import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadActivityDto } from './dto/create-lead-activity.dto';
import { UpdateLeadActivityDto } from './dto/update-lead-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from 'src/common/filter.dto';
import { ResponseService } from 'src/common/response.service';

@Injectable()
export class LeadActivityService {
  constructor(private prismaService: PrismaService) { }

  /**
   * Create a new lead activity
   * @param request 
   * @returns Promise<LeadActivity>
   */
  async create(request: CreateLeadActivityDto) {
    const leadActivity = await this.prismaService.leadActivity.create({
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
   * Get all lead activities
   * @param pagination 
   * @returns Promise<{ records: LeadActivity[]; meta: MetaData }>
   */
  async findAll(pagination: FilterDto) {
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
  async findOne(id: string) {
    const leadActivityDetails = await this.prismaService.leadActivity.findUnique({
      where: { id },
    });
    if (!leadActivityDetails)
      throw new NotFoundException(`Lead activity with ID ${id} not found`);
    return leadActivityDetails;
  }

  /**
   * Update a lead activity
   * @param id 
   * @param request 
   * @returns Promise<LeadActivity>
   */
  async update(id: string, request: UpdateLeadActivityDto) {
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
   * @returns Promise<LeadActivity>
   */
  async remove(id: string) {
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
