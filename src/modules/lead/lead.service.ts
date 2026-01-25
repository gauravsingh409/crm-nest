import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FilterDto } from 'src/common/filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ResponseService } from 'src/common/response.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeadService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Get lead details by ID
   * @param id Lead ID
   * @returns Lead with owner details
   */
  async leadDetails(id: string) {
    if (!id) {
      throw new BadRequestException('Lead ID is required');
    }

    try {
      const leadDetails = await this.prismaService.lead.findUnique({
        where: { id },
        include: {
          owner: {
            include: {
              profile: true,
            },
          },
        },
      });

      if (!leadDetails) {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }

      return leadDetails;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to fetch lead details');
    }
  }

  /**
   * Get all leads with filtering and pagination
   * @param filter FilterDto with pagination and search options
   * @returns Paginated leads with metadata
   */
  async findAll(filter: FilterDto) {
    const { limit, page, search, date, startDate, endDate, order, sortBy } =
      filter;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(search, date, startDate, endDate);

    try {
      const [leads, total] = await Promise.all([
        this.prismaService.lead.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            [sortBy || 'createdAt']: order || 'asc',
          },
          include: {
            owner: {
              include: {
                profile: true,
              },
            },
          },
        }),
        this.prismaService.lead.count({ where }),
      ]);

      return {
        records: leads,
        meta: ResponseService.paginationMetaData(total, page, limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch leads');
    }
  }

  /**
   * Create a new lead
   * @param request CreateLeadDto
   * @returns Created lead
   */
  async createLead(request: CreateLeadDto) {
    try {
      // Validate owner if provided
      if (request.owner) {
        const ownerExists = await this.prismaService.user.findUnique({
          where: { id: request.owner },
        });
        if (!ownerExists) {
          throw new BadRequestException(
            `User with ID ${request.owner} does not exist`
          );
        }
      }

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
          ...(request.owner && {
            owner: {
              connect: { id: request.owner },
            },
          }),
        },
        include: {
          owner: {
            include: {
              profile: true,
            },
          },
        },
      });

      return lead;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('A lead with this email already exists');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Referenced user does not exist');
      }
      throw new InternalServerErrorException('Failed to create lead');
    }
  }

  /**
   * Update an existing lead
   * @param id Lead ID
   * @param request UpdateLeadDto
   * @returns Updated lead
   */
  async updateLead(id: string, request: UpdateLeadDto) {
    if (!id) {
      throw new BadRequestException('Lead ID is required');
    }

    if (Object.keys(request).length === 0) {
      throw new BadRequestException('At least one field is required for update');
    }

    try {
      // Verify lead exists
      const existingLead = await this.prismaService.lead.findUnique({
        where: { id },
      });

      if (!existingLead) {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }

      // Validate owner if provided
      if (request.owner) {
        const ownerExists = await this.prismaService.user.findUnique({
          where: { id: request.owner },
        });
        if (!ownerExists) {
          throw new BadRequestException(
            `User with ID ${request.owner} does not exist`
          );
        }
      }

      const data: Prisma.LeadUpdateInput = {
        ...(request.firstName && { firstName: request.firstName }),
        ...(request.lastName && { lastName: request.lastName }),
        ...(request.phone && { phone: request.phone }),
        ...(request.email && { email: request.email }),
        ...(request.whatsapp && { whatsapp: request.whatsapp }),
        ...(request.categories && { categories: request.categories }),
        ...(request.service && { service: request.service }),
        ...(request.source && { source: request.source }),
        ...(request.address && { address: request.address }),
        ...(request.dob && { dob: new Date(request.dob) }),
        ...(request.description && { description: request.description }),
        ...(request.owner !== undefined && {
          owner: request.owner
            ? { connect: { id: request.owner } }
            : { disconnect: true },
        }),
      };

      const updatedLead = await this.prismaService.lead.update({
        where: { id },
        data,
        include: {
          owner: {
            include: {
              profile: true,
            },
          },
        },
      });

      return updatedLead;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('A lead with this email already exists');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Referenced user does not exist');
      }
      throw new InternalServerErrorException('Failed to update lead');
    }
  }

  /**
   * Delete a lead
   * @param id Lead ID
   * @returns Deleted lead
   */
  async deleteLead(id: string) {
    if (!id) {
      throw new BadRequestException('Lead ID is required');
    }

    try {
      // Verify lead exists before deletion
      const leadExists = await this.prismaService.lead.findUnique({
        where: { id },
      });

      if (!leadExists) {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }

      const deletedLead = await this.prismaService.lead.delete({
        where: { id },
        include: {
          owner: {
            include: {
              profile: true,
            },
          },
        },
      });

      return deletedLead;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Lead with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete lead');
    }
  }

  /**
   * Build where clause for filtering
   * @private
   */
  private buildWhereClause(
    search?: string,
    date?: string | Date,
    startDate?: string | Date,
    endDate?: string | Date
  ): Prisma.LeadWhereInput {
    const where: Prisma.LeadWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (date) {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const start = new Date(dateObj);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(dateObj);
      end.setUTCHours(23, 59, 59, 999);
      where.createdAt = { gte: start, lte: end };
    }

    if (startDate && endDate) {
      const startDateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
      const start = new Date(startDateObj);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(endDateObj);
      end.setUTCHours(23, 59, 59, 999);
      where.createdAt = { gte: start, lte: end };
    } else {
      if (startDate) {
        const startDateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
        const start = new Date(startDateObj);
        start.setUTCHours(0, 0, 0, 0);
        where.createdAt = { gte: start };
      }

      if (endDate) {
        const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
        const end = new Date(endDateObj);
        end.setUTCHours(23, 59, 59, 999);
        where.createdAt = { lte: end };
      }
    }

    return where;
  }
}
