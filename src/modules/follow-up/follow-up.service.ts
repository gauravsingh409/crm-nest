import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    return await this.prisma.followUp.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.followUp.findUnique({
      where: { id },
    });
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
}
