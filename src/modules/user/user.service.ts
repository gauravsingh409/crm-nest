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

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Get user details by ID
   * @param id User ID
   * @returns User with profile and roles
   */
  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: {
          profile: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return this.formatUserResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve user details');
    }
  }

  /**
   * Get all users with pagination and filtering
   * @param pagination Filter and pagination parameters
   * @returns Paginated list of users
   */
  async findAll(pagination: FilterDto) {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    try {
      const where: Prisma.UserWhereInput = search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { profile: { firstName: { contains: search, mode: 'insensitive' } } },
              { profile: { lastName: { contains: search, mode: 'insensitive' } } },
              { profile: { phone: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        this.prismaService.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            profile: true,
            roles: {
              select: {
                role: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
        this.prismaService.user.count({ where }),
      ]);

      return {
        records: users.map((user) => this.formatUserResponse(user)),
        meta: ResponseService.paginationMetaData(total, page, limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  /**
   * Create a new user
   * @param request CreateUserDto
   * @param profileImage Optional profile image path
   * @returns Created user
   */
  async createUser(request: CreateUserDto, profileImage?: string) {
    if (!request.role || request.role.length === 0) {
      throw new BadRequestException('At least one role must be assigned');
    }

    try {
      // Validate all roles exist
      const rolesCount = await this.prismaService.role.count({
        where: { id: { in: request.role } },
      });

      if (rolesCount !== request.role.length) {
        throw new BadRequestException(
          'One or more role IDs do not exist or are invalid'
        );
      }

      const hashedPassword = await bcrypt.hash(
        request.password,
        Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
      );

      const savedUser = await this.prismaService.user.create({
        data: {
          email: request.email,
          password: hashedPassword,
          profile: {
            create: {
              firstName: request.firstName,
              lastName: request.lastName,
              phone: request.phone || null,
              profile: profileImage || null,
            },
          },
          roles: {
            create: request.role.map((roleId) => ({
              role: {
                connect: { id: roleId },
              },
            })),
          },
        },
        include: {
          profile: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return this.formatUserResponse(savedUser);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      if (error.code === 'P2025') {
        throw new BadRequestException('One or more referenced roles do not exist');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Referenced role does not exist');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Update an existing user
   * @param id User ID
   * @param request UpdateUserDto
   * @param profileImage Optional new profile image path
   * @returns Updated user
   */
  async updateUser(
    id: string,
    request: UpdateUserDto,
    profileImage?: string,
  ) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    if (Object.keys(request).length === 0) {
      throw new BadRequestException('At least one field is required for update');
    }

    try {
      // Verify user exists
      const existingUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Validate roles if provided
      if (request.role && request.role.length > 0) {
        const rolesCount = await this.prismaService.role.count({
          where: { id: { in: request.role } },
        });

        if (rolesCount !== request.role.length) {
          throw new BadRequestException(
            'One or more role IDs do not exist or are invalid'
          );
        }
      }

      // Hash password if provided
      let hashedPassword = request.password;
      if (request.password) {
        hashedPassword = await bcrypt.hash(
          request.password,
          Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
        );
      }

      const profileUpdateData: any = {};
      if (request.firstName) profileUpdateData.firstName = request.firstName;
      if (request.lastName) profileUpdateData.lastName = request.lastName;
      if (request.phone) profileUpdateData.phone = request.phone;
      if (profileImage) profileUpdateData.profile = profileImage;

      const data: Prisma.UserUpdateInput = {
        ...(request.email && { email: request.email }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(Object.keys(profileUpdateData).length > 0 && {
          profile: {
            update: profileUpdateData,
          },
        }),
        ...(request.role && {
          roles: {
            deleteMany: {},
            create: request.role.map((roleId) => ({
              role: { connect: { id: roleId } },
            })),
          },
        }),
      };

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data,
        include: {
          profile: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return this.formatUserResponse(updatedUser);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Referenced role does not exist');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Delete a user
   * @param id User ID
   * @returns Deleted user info
   */
  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    try {
      // Verify user exists before deletion
      const existingUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const deletedUser = await this.prismaService.user.delete({
        where: { id },
        include: {
          profile: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return this.formatUserResponse(deletedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  /**
   * Private helper method to format user response
   * @private
   */
  private formatUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile
        ? {
            id: user.profile.id,
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            phone: user.profile.phone,
            profile: user.profile.profile,
            userId: user.profile.userId,
            createdAt: user.profile.createdAt,
            updatedAt: user.profile.updatedAt,
          }
        : null,
      roles: user.roles.map((role: any) => ({
        id: role.role.id,
        name: role.role.name,
      })),
    };
  }
}
