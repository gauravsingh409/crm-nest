import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MyJwtService } from './MyJwtService';
import { ResponseService } from 'src/common/response.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: MyJwtService,
  ) {}

  async loginUser(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);
    const loginData = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        profile: user.profile?.profile,
      },
      token: {
        accessToken,
        refreshToken,
      },
    };
    return ResponseService.success(loginData, 'User logged in', 200);
  }

  // Validate the user with email and password
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    if (!user) throw new UnauthorizedException('No user found');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user;
  }
}
