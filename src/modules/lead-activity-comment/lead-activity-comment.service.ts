import { Injectable } from '@nestjs/common';
import { CreateLeadActivityCommentDto } from './dto/create-lead-activity-comment.dto';
import { UpdateLeadActivityCommentDto } from './dto/update-lead-activity-comment.dto';

@Injectable()
export class LeadActivityCommentService {
  create(createLeadActivityCommentDto: CreateLeadActivityCommentDto) {
    return 'This action adds a new leadActivityComment';
  }

  findAll() {
    return `This action returns all leadActivityComment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leadActivityComment`;
  }

  update(id: number, updateLeadActivityCommentDto: UpdateLeadActivityCommentDto) {
    return `This action updates a #${id} leadActivityComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} leadActivityComment`;
  }
}
