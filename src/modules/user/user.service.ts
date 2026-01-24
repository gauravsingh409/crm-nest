import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterDto } from 'src/common/filter.dto';
import { ResponseService } from 'src/common/response.service';
import { Prisma } from '@prisma/client';
import { HandlePrismaException } from 'src/common/handle-prisma-exception';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }

  /**
   * Create a new user
   * @param request 
   * @param profileImage 
   * @returns Promise<User>
   */
  async createUser(request: CreateUserDto, profileImage?: string) {
    const hashedPassword = await bcrypt.hash(
      request.password,
      Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
    );
    try {
      const savedUser = await this.prismaService.user.create({
        data: {
          email: request.email,
          password: hashedPassword,
          profile: {
            create: {
              firstName: request.firstName,
              lastName: request.lastName,
              phone: request.phone,
              profile: profileImage ? profileImage : null,
            },
          },
          roles: {
            create: request.role.map((role) => ({
              role: {
                connect: {
                  id: role
                }
              }
            })
            )
          }
        },
        include: { profile: true },
      })
      return savedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Role not found');
      }
      HandlePrismaException.conflict('Branch already exist')(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Update an existing user
   * @param id 
   * @param request 
   * @param profileImage 
   * @returns Promise<User>
   */
  async updateUser(id: string, request: UpdateUserDto, profileImage?: string) {
    // 1. Handle Password Hashing if provided
    if (request.password) {
      request.password = await bcrypt.hash(
        request.password,
        Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
      );
    }

    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          email: request.email,
          password: request.password,
          // Update Profile (Nested)
          profile: {
            update: {
              firstName: request.firstName,
              lastName: request.lastName,
              phone: request.phone,
              ...(profileImage && { profile: profileImage }),
            },
          },
          // Update Roles (Many-to-Many Bridge Table)
          ...(request.role && {
            roles: {
              deleteMany: {}, // Wipe existing roles for this user
              create: request.role.map((roleId) => ({
                role: {
                  connect: { id: roleId },
                },
              })),
            },
          }),
        },
        include: { profile: true },
      });

      return updatedUser;
    } catch (error) {
      // 2. Consistent Error Handling (matching your createUser style)
      if (error.code === 'P2025') {
        throw new BadRequestException('User or Role not found');
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Get all users
   * @param pagination 
   * @returns Promise<{ records: User[]; meta: MetaData }>
   */
  async findAll(pagination: FilterDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: { profile: true, roles: { select: { role: true } } },
      }),
      this.prismaService.user.count(),
    ]);
    const flattenedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      profile: user.profile?.profile,
      firstName: user?.profile?.firstName,
      lastName: user?.profile?.lastName,
      phone: user?.profile?.phone,
      roles: user.roles.map((role) => ({
        id: role.role.id,
        name: role.role.name
      })),
    }));
    return {
      records: flattenedUsers,
      meta: ResponseService.paginationMetaData(
        total,
        pagination.page,
        pagination.limit,
      ),
    };
  }

  /**
   * Delete a user
   * @param id 
   * @returns Promise<{ message: string; user: User }>
   */
  async remove(id: string) {
    try {
      const deletedUser = await this.prismaService.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      });

      return {
        message: 'User deleted successfully',
        user: deletedUser,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma error code for "Record not found"
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Get user details
   * @param id 
   * @returns Promise<User>
   */
  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id, profile: {

        }
      },
      include: {
        profile: true, roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
      },
    });


    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      profile: user.profile?.profile,
      firstName: user?.profile?.firstName,
      lastName: user?.profile?.lastName,
      phone: user?.profile?.phone,
      roles: user.roles.map((role) => ({
        id: role.role.id,
        name: role.role.name
      })),
    }
  }

}
