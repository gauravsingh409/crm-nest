import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MyJwtService } from './MyJwtService';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, MyJwtService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
