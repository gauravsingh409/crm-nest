import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MyJwtService } from './MyJwtService';
import { ResponseModule } from 'src/common/response/response.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ResponseModule,
  ],
  providers: [AuthService, MyJwtService],
  controllers: [AuthController],
})
export class AuthModule {}
