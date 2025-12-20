import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { ResponseService } from 'src/common/response/response.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private responseService: ResponseService,
  ) {}

  async createUser(request: CreateUserDto) {
    const hashPassword = await bcrypt.hash(
      request.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
    );
    try {
      const user = await this.prismaService.user.create({
        data: {
          profile: {
            create: {
              firstName: request.firstName,
              lastName: request.lastName,
              phone: request.phone,
            },
          },
          email: request.email,
          password: hashPassword,
          role: request.role,
        },
        select: {
          id: true,
          email: true,
          role: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      // 4. Handle unique constraint violation (email)
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  async updateUser(id: string, request: UpdateUserDto) {
    if (request.password) {
      request.password = await bcrypt.hash(
        request.password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
      );
    }

    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          ...(request.email && { email: request.email }),
          ...(request.password && { password: request.password }),
          ...(request.role && { role: request.role }),
          profile: {
            update: {
              ...(request.firstName && { firstName: request.firstName }),
              ...(request.lastName && { lastName: request.lastName }),
              ...(request.phone && { phone: request.phone }),
              firstName: request.firstName,
              lastName: request.lastName,
              phone: request.phone,
            },
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          updatedAt: true,
        },
      });

      return updatedUser;
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
      }),
      this.prismaService.user.count(),
    ]);

    return {
      records: users,
      meta: this.responseService.paginationMetaData(
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
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.prismaService.user.findUnique({
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
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      message: 'User details retrieved successfully',
      user,
    };
  }
}
