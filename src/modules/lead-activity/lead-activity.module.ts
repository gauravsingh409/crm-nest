import { Module } from '@nestjs/common';
import { LeadActivityService } from './lead-activity.service';
import { LeadActivityController } from './lead-activity.controller';

@Module({
  controllers: [LeadActivityController],
  providers: [LeadActivityService],
})
export class LeadActivityModule {}
