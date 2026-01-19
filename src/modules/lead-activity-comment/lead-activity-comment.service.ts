import { Injectable } from '@nestjs/common';
import { CreateLeadActivityCommentDto } from './dto/create-lead-activity-comment.dto';
import { UpdateLeadActivityCommentDto } from './dto/update-lead-activity-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeadActivityCommentService {
  constructor(private prismaService: PrismaService) { }


  async create(request: CreateLeadActivityCommentDto, userId: string) {
    const leadActivityComment = await this.prismaService.leadActivityComment.create({
      data: {
        leadActivityId: request.leadActivityId,
        comment: request.content,
        commentById: userId,

      }
    })
    return leadActivityComment;
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
