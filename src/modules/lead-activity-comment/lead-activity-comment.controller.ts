import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeadActivityCommentService } from './lead-activity-comment.service';
import { CreateLeadActivityCommentDto } from './dto/create-lead-activity-comment.dto';
import { UpdateLeadActivityCommentDto } from './dto/update-lead-activity-comment.dto';
import { ResponseService } from 'src/common/response.service';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { RolesGuard } from 'src/common/gaurds/role.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/constant/permission';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('lead-activity-comment')
export class LeadActivityCommentController {
  constructor(private readonly leadActivityCommentService: LeadActivityCommentService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(PERMISSIONS.LEAD_ACTIVITY_COMMENT_CREATE)
  async create(@Body() createLeadActivityCommentDto: CreateLeadActivityCommentDto, @GetUser() user: any) {
    const leadActivityComment = await this.leadActivityCommentService.create(createLeadActivityCommentDto, user.id);
    return ResponseService.success(leadActivityComment, "Lead Activity Comment Created Successfully", 201);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(PERMISSIONS.LEAD_ACTIVITY_COMMENT_READ)
  findAll() {
    const leadActivityComment = this.leadActivityCommentService.findAll();
    return ResponseService.success(leadActivityComment, "Lead Activity Comment Fetched Successfully");
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(PERMISSIONS.LEAD_ACTIVITY_COMMENT_READ)
  findOne(@Param('id') id: string) {
    const leadActivityComment = this.leadActivityCommentService.findOne(+id);
    return ResponseService.success(leadActivityComment, "Lead Activity Comment Fetched Successfully");
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(PERMISSIONS.LEAD_ACTIVITY_COMMENT_UPDATE)
  update(@Param('id') id: string, @Body() updateLeadActivityCommentDto: UpdateLeadActivityCommentDto) {
    const leadActivityComment = this.leadActivityCommentService.update(+id, updateLeadActivityCommentDto);
    return ResponseService.success(leadActivityComment, "Lead Activity Comment Updated Successfully");
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(PERMISSIONS.LEAD_ACTIVITY_COMMENT_DELETE)
  remove(@Param('id') id: string) {
    const leadActivityComment = this.leadActivityCommentService.remove(+id);
    return ResponseService.success(leadActivityComment, "Lead Activity Comment Deleted Successfully");
  }
}
