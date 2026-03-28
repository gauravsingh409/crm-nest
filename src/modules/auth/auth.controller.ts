import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ResponseService } from 'src/common/response.service';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.loginUser(body.email, body.password, res);
    return ResponseService.success(response, 'User logged in', 200)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@GetUser() user: any) {
    return ResponseService.success(user, 'User profile fetched', 200);
  }
}
