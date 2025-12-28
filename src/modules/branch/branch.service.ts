import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ResponseService } from 'src/common/response/response.service';

@Injectable()
export class BranchService {
  constructor(
    private prismaService: PrismaService,
    private responseService: ResponseService,
  ) {}

  async create(request: CreateBranchDto) {
    try {
      return await this.prismaService.branch.create({
        data: {
          name: request.name,
          address: request.address,
          phone: request.phone,
          description: request.description,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException('Branch already exist');
        }
      }
      throw new InternalServerErrorException('Failed to create branch');
    }
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [branch, total] = await Promise.all([
      this.prismaService.branch.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
      }),
      this.prismaService.branch.count(),
    ]);
    return {
      records: branch,
      meta: this.responseService.paginationMetaData(total, page, limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} branch`;
  }

  async update(id: string, request: UpdateBranchDto) {
    try {
      await this.prismaService.branch.update({
        where: { id: id },
        data: {
          name: request.name,
          address: request.address,
          phone: request.phone,
          description: request.description,
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Branch Not found');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
