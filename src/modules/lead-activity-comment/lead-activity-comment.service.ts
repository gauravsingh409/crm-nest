import { Injectable } from '@nestjs/common';
import { CreateLeadActivityCommentDto } from './dto/create-lead-activity-comment.dto';
import { UpdateLeadActivityCommentDto } from './dto/update-lead-activity-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from 'src/common/filter.dto';
import { ResponseService } from 'src/common/response.service';
import { HandlePrismaException } from 'src/common/handle-prisma-exception';

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

  async findAll(filter: FilterDto) {
    const [count, leadActivityComment] = await Promise.all([
      await this.prismaService.leadActivityComment.count({
        where: {
          leadActivityId: filter['lead-activity-id'],
        },
      }),
      await this.prismaService.leadActivityComment.findMany({
        include: {
          leadActivity: true,
        },
        where: {
          leadActivityId: filter['lead-activity-id'],
        },
      })
    ])
    return {
      records: leadActivityComment,
      meta: ResponseService.paginationMetaData(count, filter.page, filter.limit),
    };
  }

  async findOne(id: string) {
    const leadActivityComment = await this.prismaService.leadActivityComment.findUnique({
      where: {
        id: id,
      },
    })
    return leadActivityComment;
  }

  async update(id: string, request: UpdateLeadActivityCommentDto) {
    const leadActivityComment = await this.prismaService.leadActivityComment.update({
      where: {
        id: id,
      },
      data: {
        comment: request.content,
      },
    })
    return leadActivityComment;
  }

  async remove(id: string) {
    try {
      const leadActivityComment = await this.prismaService.leadActivityComment.delete({
        where: {
          id: id,
        },
      })
      return leadActivityComment;
    } catch (error) {
      HandlePrismaException.notFound("Comment not found")(error);
    }

  }
}
