import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CookieOptions, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MyJwtService } from './MyJwtService';
import { ResponseService } from 'src/common/response.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: MyJwtService,
  ) { }

  async loginUser(email: string, password: string, res: Response) {
    const user = await this.validateUser(email, password);
    const accessToken = this.jwtService.generateAccessToken({
      email: user.email,
      sub: user.id,
    });
    const refreshToken = this.jwtService.generateRefreshToken({
      email: user.email,
      sub: user.id,
    });

    // Set cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",

    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    });





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
