import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { ResponseModule } from 'src/common/response/response.module';

@Module({
  imports: [ResponseModule],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
