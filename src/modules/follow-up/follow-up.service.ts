import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from 'src/common/filter.dto';
import { Prisma } from '@prisma/client';
import { ResponseService } from 'src/common/response.service';

@Injectable()
export class FollowUpService {
  constructor(private prisma: PrismaService) { }
  async create(request: CreateFollowUpDto) {
    try {
      const followUp = await this.prisma.followUp.create({
        data: {
          title: request.title,
          date_time: request.date_time,
          remainder: request.remainder,
          service: request.service,
          appointment_date_time: request.appointment_date_time,
          lead: {
            connect: {
              id: request.lead_id
            }
          },
          branch: {
            connect: {
              id: request.branch_id
            }
          },
          doctor: {
            connect: {
              id: request.doctor_id
            }
          },
          assignee: {
            connect: {
              id: request.assignee_id
            }
          },
        },
      });
      return followUp;
    } catch (error) {
      // HandlePrismaException.
      throw new BadRequestException(error);
    }

  }

  async findAll(filterDto: FilterDto) {
    const { page, limit, order } = filterDto;
    const skip = (page - 1) * limit;
    const [total, followUp] = await Promise.all([
      this.prisma.followUp.count(),
      this.prisma.followUp.findMany({
        skip,
        take: limit,
        where: this.buildWhereClause(filterDto),
        orderBy: {
          createdAt: order ? order : 'desc',
        }
      }),
    ])
    return {
      meta: ResponseService.paginationMetaData(total, page, limit),
      data: followUp,

    }
  }

  async findOne(id: string) {
    const followUp = await this.prisma.followUp.findUnique({
      where: { id },
      include: {
        lead: true,
        branch: true,
        doctor: true,
        assignee: true,
      }
    });

    if (!followUp) {
      throw new NotFoundException(`Follow-up with ID ${id} not found`);
    }
    return followUp;
  }

  async update(id: string, updateFollowUpDto: UpdateFollowUpDto) {
    return await this.prisma.followUp.update({
      where: { id },
      data: updateFollowUpDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.followUp.delete({
      where: { id },
    });
  }

  // Build where clause
  private buildWhereClause(filterDto: FilterDto) {
    const whereClause: Prisma.FollowUpWhereInput = {};

    if (filterDto.search) {
      whereClause.OR = [
        { title: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    if (filterDto.date) {
      const start = new Date(filterDto.date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(filterDto.date);
      end.setUTCHours(23, 59, 59, 999);
      whereClause.date_time = { gte: start, lte: end };
    }

    if (filterDto.endDate) {
      const end = new Date(filterDto.endDate);
      end.setUTCHours(23, 59, 59, 999);
      whereClause.createdAt = { lte: end };
    }

    if (filterDto.startDate) {
      const start = new Date(filterDto.startDate);
      start.setUTCHours(0, 0, 0, 0);
      whereClause.createdAt = { gte: start };
    }

    return whereClause;
  }
}
