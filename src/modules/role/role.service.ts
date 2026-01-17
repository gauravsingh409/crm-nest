import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Remove a role by id
   * @param id 
   * @returns Promise<Role>
   */
  async remove(id: string) {
    return await this.prismaService.$transaction(async (tx) => {

      // 1. Check existence first
      const roleExists = await tx.role.findUnique({
        where: { id }
      });

      if (!roleExists) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      // 2. Safety Check: Protect Users
      const userCount = await tx.userRole.count({
        where: { roleId: id }
      });

      if (userCount > 0) {
        throw new BadRequestException(
          `Security Risk: Cannot delete role. It is currently assigned to ${userCount} users.`
        );
      }

      // 3. Clean up the Bridge Table
      await tx.rolePermission.deleteMany({
        where: { roleId: id }
      });

      // 4. Delete the actual Role
      return await tx.role.delete({
        where: { id }
      });
    });
  }
}
