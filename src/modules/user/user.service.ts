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
import { PaginationDto } from 'src/common/pagination.dto';
import { ResponseService } from 'src/common/response.service';
import { Prisma, User, UserProfile } from '@prisma/client';
import path from 'path';
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
        omit: { password: true },
      })
      return this.mapUserAndProfile(savedUser);
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
    if (request.password) {
      request.password = await bcrypt.hash(
        request.password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
      );
    }

    try {

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        omit: { password: true },
        include: { profile: true },
        data: {
          ...(request.email && { email: request.email }),
          ...(request.password && { password: request.password }),
          profile: {
            update: {
              ...(request.firstName && { firstName: request.firstName }),
              ...(request.lastName && { lastName: request.lastName }),
              ...(request.phone && { phone: request.phone }),
              ...(profileImage && { profile: profileImage }),
            },
          },
        },
      });

      return this.mapUserAndProfile(updatedUser);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async getAllUser(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: { profile: true },
      }),
      this.prismaService.user.count(),
    ]);
    const flattenedUsers = users.map((user) => this.mapUserAndProfile(user));
    return {
      records: flattenedUsers,
      meta: ResponseService.paginationMetaData(
        total,
        pagination.page,
        pagination.limit,
      ),
    };
  }

  async deleteUser(id: string) {
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

  async getUserDetails(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      omit: { password: true },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapUserAndProfile(user);
  }

  mapUserAndProfile(
    user: Omit<User, 'password'> & { profile: UserProfile | null },
  ) {
    const appUrl = process.env.APP_URL;
    return {
      id: user.id,
      firstName: user.profile?.firstName ?? null,
      lastName: user.profile?.lastName ?? null,
      phone: user.profile?.phone ?? null,
      profileImage: user.profile?.profile
        ? `${appUrl}${user.profile.profile}`
        : null,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
