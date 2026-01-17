import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ResponseService } from 'src/common/response.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateLeadActivityDto } from './dto/create-lead-activity.dto';
import { UpdateLeadActivityDto } from './dto/update-lead-activity.dto';

@Injectable()
export class LeadService {
  constructor(private prismaService: PrismaService) { }

  async leadDetails(id: string) {
    const leadDetails = this.prismaService.lead.findUnique({
      where: { id },
    });
    if (!leadDetails)
      throw new NotFoundException(`Lead with ID ${id} not found`);

    return leadDetails;
  }

  async findAll(pagination: PaginationDto) {
    const { limit, page } = pagination;
    const skip = (page - 1) * limit;
    const [lead, total] = await Promise.all([
      this.prismaService.lead.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prismaService.lead.count(),
    ]);
    return {
      records: lead,
      meta: ResponseService.paginationMetaData(total, page, limit),
    };
  }

  async createLead(request: CreateLeadDto) {
    try {
      const lead = await this.prismaService.lead.create({
        data: {
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          phone: request.phone,
          whatsapp: request.whatsapp,
          address: request.address,
          dob: request.dob ? new Date(request.dob) : undefined,
          categories: request.categories,
          service: request.service,
          source: request.source,
          description: request.description,
        },
      });

      return lead;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create lead');
    }
  }

  async updateLead(id: string, request: UpdateLeadDto) {
    if (Object.keys(request).length === 0) {
      throw new BadRequestException('No fields provided for update');
    }
    try {
      const updatedLead = await this.prismaService.lead.update({
        where: { id },
        data: {
          ...(request.firstName && { firstName: request.firstName }),
          ...(request.lastName && { lastName: request.lastName }),
          ...(request.phone && { phone: request.phone }),
          ...(request.email && { email: request.email }),
          ...(request.whatsapp && { whatsapp: request.whatsapp }),
          ...(request.categories && { categories: request.categories }),
          ...(request.service && { service: request.service }),
          ...(request.source && { source: request.source }),
          ...(request.owner && {
            owner: request.owner
              ? { connect: { id: request.owner } }
              : { disconnect: true },
          }),
          ...(request.address && { address: request.address }),
          ...(request.dob && { dob: new Date(request.dob) }),
          ...(request.description && { description: request.description }),
        },
      });
      return updatedLead;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to update lead');
    }
  }

  async deleteLead(id: string) {
    try {
      const deleteLead = await this.prismaService.lead.delete({
        where: { id },
      });
      return deleteLead;
    } catch (error) {
      console.log('lead not found error---------->', error);
      if (error.code === 'P2025') {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * ===================================================================
   *                      Lead Activity
   * ===================================================================
   */

  /**
   * Get all lead activities
   * @param pagination 
   * @returns Promise<{ records: LeadActivity[]; meta: MetaData }>
   */
  async findAllLeadActivity(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const response = await this.prismaService.leadActivity.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
    return {
      records: response,
      meta: ResponseService.paginationMetaData(response.length, page, limit),
    };
  }

  /**
   * Get lead activity details
   * @param id 
   * @returns Promise<LeadActivity>
   */
  async findOneLeadActivity(id: string) {
    const leadActivityDetails = await this.prismaService.leadActivity.findUnique({
      where: { id },
    });
    if (!leadActivityDetails)
      throw new NotFoundException(`Lead activity with ID ${id} not found`);
    return leadActivityDetails;
  }

  /**
   * Create a new lead activity
   * @param request 
   * @returns Promise<LeadActivity>
   */
  async createLeadActivity(request: CreateLeadActivityDto) {
    const leadActivity = await this.prismaService.leadActivity.create({
      data: {
        type: request.type,
        callOutcome: request.callOutcome,
        durationSec: request.durationSec,
        lead: {
          connect: {
            id: request.leadId
          }
        },
        notes: request.notes,
        performedBy: {
          connect: {
            id: request.performedById
          }
        },
      },
    });
    return leadActivity;
  }

  /**
   * Update a lead activity
   * @param id 
   * @param request 
   * @returns Promise<LeadActivity>
   */
  async updateLeadActivity(id: string, request: UpdateLeadActivityDto) {
    const leadActivity = await this.prismaService.leadActivity.update({
      where: { id },
      data: {
        lead: {
          connect: {
            id: request.leadId
          }
        },
        type: request.type,
        callOutcome: request.callOutcome,
        durationSec: request.durationSec,
        notes: request.notes,
        performedBy: {
          connect: {
            id: request.performedById
          }
        },
      },
    });
    return leadActivity;
  }

  /**
   * Delete a lead activity
   * @param id 
   * @returns Promise<{ message: string; leadActivity: LeadActivity }>
   */
  async removeLeadActivity(id: string) {
    const deletedLeadActivity = await this.prismaService.leadActivity.delete({
      where: { id },
    });
    return ResponseService.success(
      deletedLeadActivity,
      'Lead activity deleted successfully',
      200,
    );
  }
}
