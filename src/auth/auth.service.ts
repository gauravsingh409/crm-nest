import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MyJwtService } from './MyJwtService';
import { ResponseService } from 'src/common/response/response.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: MyJwtService,
    private responseService: ResponseService,
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
      },
      token: {
        accessToken,
        refreshToken,
      },
    };
    return this.responseService.success(loginData, 'User logged in', 200);
  }

  // Validate the user with email and password
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
