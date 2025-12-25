import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { ResponseModule } from 'src/common/response/response.module';

@Module({
  imports: [ResponseModule],
  providers: [LeadService],
  controllers: [LeadController],
})
export class LeadModule {}
