import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from 'src/common/filter.dto';
import { Prisma } from '@prisma/client';
import { ResponseService } from 'src/common/response.service';

@Injectable()
export class FollowUpService {
  constructor(private prisma: PrismaService) { }

  /**
   * Create a new follow-up with validation
   * @param request CreateFollowUpDto
   * @returns Created follow-up with related data
   */
  async create(request: CreateFollowUpDto) {
    try {
      // Validate date relationships
      this.validateDates(
        request.date_time,
        request.remainder,
        request.appointment_date_time
      );

      // Verify all related entities exist
      await this.validateRelatedEntities(request);

      const followUp = await this.prisma.followUp.create({
        data: {
          title: request.title,
          date_time: new Date(request.date_time),
          remainder: new Date(request.remainder),
          service: request.service,
          appointment_date_time: new Date(request.appointment_date_time),
          lead: {
            connect: {
              id: request.lead_id,
            },
          },
          branch: {
            connect: {
              id: request.branch_id,
            },
          },
          doctor: {
            connect: {
              id: request.doctor_id,
            },
          },
          assignee: {
            connect: {
              id: request.assignee_id,
            },
          },
        },
        include: {
          lead: true,
          branch: true,
          doctor: true,
          assignee: {
            include: {
              profile: true,
            },
          },
        },
      });

      return followUp;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  /**
   * Get all follow-ups with filtering and pagination
   * @param filterDto Filter and pagination options
   * @returns Paginated follow-ups with metadata
   */
  async findAll(filterDto: FilterDto) {
    const { page, limit, order } = filterDto;
    const skip = (page - 1) * limit;

    try {
      const [total, followUps] = await Promise.all([
        this.prisma.followUp.count({
          where: this.buildWhereClause(filterDto),
        }),
        this.prisma.followUp.findMany({
          skip,
          take: limit,
          where: this.buildWhereClause(filterDto),
          orderBy: {
            createdAt: order ? (order as Prisma.SortOrder) : 'desc',
          },
          include: {
            lead: true,
            branch: true,
            doctor: true,
            assignee: {
              include: {
                profile: true,
              },
            },
          },
        }),
      ]);

      return {
        meta: ResponseService.paginationMetaData(total, page, limit),
        data: followUps,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch follow-ups');
    }
  }

  /**
   * Get a single follow-up by ID
   * @param id Follow-up ID
   * @returns Follow-up with related data
   */
  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Follow-up ID is required');
    }

    try {
      const followUp = await this.prisma.followUp.findUnique({
        where: { id },
        include: {
          lead: true,
          branch: true,
          doctor: true,
          assignee: {
            include: {
              profile: true,
            },
          },
        },
      });

      if (!followUp) {
        throw new NotFoundException(
          `Follow-up with ID ${id} not found`
        );
      }

      return followUp;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Follow-up with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to fetch follow-up');
    }
  }

  /**
   * Update a follow-up
   * @param id Follow-up ID
   * @param updateFollowUpDto Update data
   * @returns Updated follow-up
   */
  async update(id: string, updateFollowUpDto: UpdateFollowUpDto) {
    if (!id) {
      throw new BadRequestException('Follow-up ID is required');
    }

    try {
      // Check if follow-up exists
      await this.findOne(id);

      // Validate dates if any are provided
      if (
        updateFollowUpDto.date_time ||
        updateFollowUpDto.remainder ||
        updateFollowUpDto.appointment_date_time
      ) {
        const existing = await this.prisma.followUp.findUnique({
          where: { id },
        });

        if(!existing) {
          throw new NotFoundException(`Follow-up with ID ${id} not found`);
        }

        this.validateDates(
          updateFollowUpDto?.date_time || existing?.date_time.toISOString(),
          updateFollowUpDto.remainder || existing?.remainder.toISOString(),
          updateFollowUpDto.appointment_date_time || existing?.appointment_date_time.toISOString()
        );
      }

      // Validate related entities if any are being changed
      if (
        updateFollowUpDto.lead_id ||
        updateFollowUpDto.branch_id ||
        updateFollowUpDto.doctor_id ||
        updateFollowUpDto.assignee_id
      ) {
        const existingData = await this.prisma.followUp.findUnique({
          where: { id },
        });

        await this.validateRelatedEntities({
          lead_id: updateFollowUpDto.lead_id || existingData?.lead_id,
          branch_id: updateFollowUpDto.branch_id || existingData?.branch_id,
          doctor_id: updateFollowUpDto.doctor_id || existingData?.doctor_id,
          assignee_id: updateFollowUpDto.assignee_id || existingData?.assignee_id,
          title: updateFollowUpDto.title || '',
          date_time: updateFollowUpDto.date_time || '',
          remainder: updateFollowUpDto.remainder || '',
          service: updateFollowUpDto.service || null,
          appointment_date_time: updateFollowUpDto.appointment_date_time || '',
        } as CreateFollowUpDto);
      }

      const data: Prisma.FollowUpUpdateInput = {
        ...(updateFollowUpDto.title && { title: updateFollowUpDto.title }),
        ...(updateFollowUpDto.date_time && {
          date_time: new Date(updateFollowUpDto.date_time),
        }),
        ...(updateFollowUpDto.remainder && {
          remainder: new Date(updateFollowUpDto.remainder),
        }),
        ...(updateFollowUpDto.service && { service: updateFollowUpDto.service }),
        ...(updateFollowUpDto.appointment_date_time && {
          appointment_date_time: new Date(
            updateFollowUpDto.appointment_date_time
          ),
        }),
        ...(updateFollowUpDto.lead_id && {
          lead: { connect: { id: updateFollowUpDto.lead_id } },
        }),
        ...(updateFollowUpDto.branch_id && {
          branch: { connect: { id: updateFollowUpDto.branch_id } },
        }),
        ...(updateFollowUpDto.doctor_id && {
          doctor: { connect: { id: updateFollowUpDto.doctor_id } },
        }),
        ...(updateFollowUpDto.assignee_id && {
          assignee: { connect: { id: updateFollowUpDto.assignee_id } },
        }),
      };

      const updatedFollowUp = await this.prisma.followUp.update({
        where: { id },
        data,
        include: {
          lead: true,
          branch: true,
          doctor: true,
          assignee: {
            include: {
              profile: true,
            },
          },
        },
      });

      return updatedFollowUp;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.handlePrismaError(error);
    }
  }

  /**
   * Delete a follow-up
   * @param id Follow-up ID
   * @returns Deleted follow-up
   */
  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('Follow-up ID is required');
    }

    try {
      // Check if follow-up exists before deletion
      await this.findOne(id);

      const deletedFollowUp = await this.prisma.followUp.delete({
        where: { id },
        include: {
          lead: true,
          branch: true,
          doctor: true,
          assignee: {
            include: {
              profile: true,
            },
          },
        },
      });

      return deletedFollowUp;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Follow-up with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete follow-up');
    }
  }

  /**
   * Validate date relationships
   * @private
   */
  private validateDates(dateTime: string, reminder: string, appointmentDateTime: string) {
    const dt = new Date(dateTime);
    const rem = new Date(reminder);
    const appt = new Date(appointmentDateTime);

    if (isNaN(dt.getTime()) || isNaN(rem.getTime()) || isNaN(appt.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please provide valid ISO 8601 dates'
      );
    }

    if (rem >= dt) {
      throw new BadRequestException(
        'Reminder date must be before follow-up date'
      );
    }

    if (appt <= dt) {
      throw new BadRequestException(
        'Appointment date must be after follow-up date'
      );
    }
  }

  /**
   * Validate all related entities exist
   * @private
   */
  private async validateRelatedEntities(request: CreateFollowUpDto) {
    const [lead, branch, doctor, assignee] = await Promise.all([
      this.prisma.lead.findUnique({ where: { id: request.lead_id } }),
      this.prisma.branch.findUnique({ where: { id: request.branch_id } }),
      this.prisma.doctor.findUnique({ where: { id: request.doctor_id } }),
      this.prisma.user.findUnique({ where: { id: request.assignee_id } }),
    ]);

    const errors: string[] = [];

    if (!lead) errors.push(`Lead with ID ${request.lead_id} not found`);
    if (!branch) errors.push(`Branch with ID ${request.branch_id} not found`);
    if (!doctor) errors.push(`Doctor with ID ${request.doctor_id} not found`);
    if (!assignee) errors.push(`Assignee with ID ${request.assignee_id} not found`);

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('; '));
    }
  }

  /**
   * Build where clause for filtering
   * @private
   */
  private buildWhereClause(filterDto: FilterDto) {
    const whereClause: Prisma.FollowUpWhereInput = {};

    if (filterDto.search) {
      whereClause.OR = [
        { title: { contains: filterDto.search, mode: 'insensitive' } },
        { lead: { firstName: { contains: filterDto.search, mode: 'insensitive' } } },
        { lead: { lastName: { contains: filterDto.search, mode: 'insensitive' } } },
      ];
    }

    if (filterDto.date) {
      const start = new Date(filterDto.date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(filterDto.date);
      end.setUTCHours(23, 59, 59, 999);
      whereClause.date_time = { gte: start, lte: end };
    }

    if (filterDto.startDate && filterDto.endDate) {
      const start = new Date(filterDto.startDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(filterDto.endDate);
      end.setUTCHours(23, 59, 59, 999);
      whereClause.createdAt = { gte: start, lte: end };
    } else {
      if (filterDto.startDate) {
        const start = new Date(filterDto.startDate);
        start.setUTCHours(0, 0, 0, 0);
        whereClause.createdAt = { gte: start };
      }

      if (filterDto.endDate) {
        const end = new Date(filterDto.endDate);
        end.setUTCHours(23, 59, 59, 999);
        whereClause.createdAt = { lte: end };
      }
    }

    return whereClause;
  }

  /**
   * Handle Prisma errors
   * @private
   */
  private handlePrismaError(error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      throw new ConflictException(`A follow-up with this ${field} already exists`);
    }

    if (error.code === 'P2025') {
      throw new NotFoundException('Follow-up not found');
    }

    if (error.code === 'P2003') {
      throw new BadRequestException('Invalid reference to related entity');
    }

    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    throw new InternalServerErrorException(
      'Failed to perform follow-up operation. Please try again later.'
    );
  }
}
