import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandlePrismaException } from 'src/common/handle-prisma-exception';

@Injectable()
export class DoctorService {
  constructor(private prismaService: PrismaService) { }

  async create(request: CreateDoctorDto) {
    const branch = await this.prismaService.branch.findUnique({
      where: {
        id: request.branch,
      },
    });

    if (!branch) {
      throw new BadRequestException("Branch not found");
    }

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

  findAll() {
    return `This action returns all doctor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
