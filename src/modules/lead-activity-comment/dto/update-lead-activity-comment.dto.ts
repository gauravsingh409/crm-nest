import { PartialType } from '@nestjs/swagger';
import { CreateLeadActivityCommentDto } from './create-lead-activity-comment.dto';

export class UpdateLeadActivityCommentDto extends PartialType(CreateLeadActivityCommentDto) {}
