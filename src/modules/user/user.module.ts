import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ResponseModule } from 'src/common/response/response.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [],
  imports: [ResponseModule],
})
export class UserModule {}
