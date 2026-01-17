import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class MyJwtService {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Generate access token
  generateAccessToken(payload: { sub: string; email: string }) {
    return this.jwtService.sign(
      { ...payload, type: 'access' },
      {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: '1d',
      },
    );
  }

  generateRefreshToken(payload: { sub: string; email: string }) {
    return this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }
}
