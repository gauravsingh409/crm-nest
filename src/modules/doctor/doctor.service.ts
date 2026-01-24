import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandlePrismaException } from 'src/common/handle-prisma-exception';
import { FilterDto } from 'src/common/filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private prismaService: PrismaService) { }

  async create(request: CreateDoctorDto) {
    // const branch = await this.prismaService.branch.findUnique({
    //   where: {
    //     id: request.branch,
    //   },
    // });

    // if (!branch) {
    //   throw new BadRequestException("Branch not found");
    // }

    const doctor = await this.prismaService.doctor.create({
      data: {
        name: request.name,
        phone: request.phone,
        branch: {
          connect: {
            id: request.branch,
          },
        },

      },
    });
    return doctor;
  }

  async findAll(filter: FilterDto) {
    const { page, limit, search, order, date, endDate, sortBy, startDate } = filter;
    const skip = (page - 1) * limit;

    const doctors = await this.prismaService.doctor.findMany({
      where: this.buildDoctorWhereClause(filter),
      orderBy: {
        createdAt: order || 'asc',
      },
      skip,
      take: limit,
    });

    return doctors;
  }

  findOne(id: string) {
    return `This action returns a #${id} doctor`;
  }

  update(id: string, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: string) {
    return `This action removes a #${id} doctor`;
  }

  // 

  private buildDoctorWhereClause(filter: FilterDto): Prisma.DoctorWhereInput {
    const { search, order, date, endDate, sortBy, startDate } = filter;
    const where: Prisma.DoctorWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { branch: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setUTCHours(23, 59, 59, 999);
      where.createdAt = { gte: start, lte: end };
    }

    return where;
  }
}
