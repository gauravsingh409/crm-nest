import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BootstrapService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.createSuperAdmin();
  }

  private async createSuperAdmin() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const firstName = process.env.SUPER_ADMIN_FIRST_NAME;
    const lastName = process.env.SUPER_ADMIN_LAST_NAME;

    if (!email || !password || !firstName || !lastName) {
      this.logger.warn(
        'Super admin credentials not provided. Skipping creation.',
      );
      return;
    }

    const existingAdmin = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      this.logger.log('Super admin already exists. Skipping.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
    });

    this.logger.log('Super admin created successfully.');
  }
}
