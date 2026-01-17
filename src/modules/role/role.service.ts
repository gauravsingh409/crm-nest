import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {

  constructor(private prismaService: PrismaService) { }

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.prismaService.role.findUnique({
      where: {
        name: createRoleDto.name
      }
    })

    if (existingRole) {
      throw new ConflictException('Role already exists')
    }

    const role = await this.prismaService.role.create({
      data: {
        name: createRoleDto.name,
        permissions: {
          create: createRoleDto.permissions.map((id) => ({
            permission: {
              connect: {
                id: id
              }
            }
          }))
        }
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })
    return role;
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
