import { Module } from '@nestjs/common';
import { LeadActivityCommentService } from './lead-activity-comment.service';
import { LeadActivityCommentController } from './lead-activity-comment.controller';

@Module({
  controllers: [LeadActivityCommentController],
  providers: [LeadActivityCommentService],
})
export class LeadActivityCommentModule {}
