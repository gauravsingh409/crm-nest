import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandlePrismaException } from 'src/common/handle-prisma-exception';

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

  async findAll() {
    const roles = await this.prismaService.role.findMany()
    return roles;
  }

  async findOne(id: string) {
    try {
      const role = await this.prismaService.role.findUniqueOrThrow({
        where: {
          id: id
        },
        select: {
          id: true,
          name: true,
          permissions: {
            include: {
              permission: true
            }
          }
        }
      })
      return {
        id: role.id,
        name: role.name,
        permissions: role.permissions.map((permission) => permission.permission)
      };
    } catch (error) {
      return HandlePrismaException.notFound('Role not found')(error);
    }


  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.prismaService.role.update({
        where: {
          id: id
        },
        data: {
          name: updateRoleDto.name,
          permissions: {
            deleteMany: {
              roleId: id,
            },
            create: updateRoleDto?.permissions?.map((id) => ({
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
              permission: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      })
      return role;
    } catch (error) {
      return HandlePrismaException.notFound('Role not found')(error);
    }
  }

  async remove(id: string) {
    try {
      const role = await this.prismaService.role.delete({
        where: {
          id: id
        }
      })
      return role;
    } catch (error) {
      return HandlePrismaException.notFound('Role not found')(error);
    }
  }
}
