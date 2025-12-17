import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MyJwtService {
  constructor(private jwtService: JwtService) {}

  // Generate access token
  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m', // short-lived
    });
  }

  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d', // long-lived
    });
  }

  // Validate access token
  validateAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
