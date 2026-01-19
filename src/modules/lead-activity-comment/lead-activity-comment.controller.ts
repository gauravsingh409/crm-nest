import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeadActivityCommentService } from './lead-activity-comment.service';
import { CreateLeadActivityCommentDto } from './dto/create-lead-activity-comment.dto';
import { UpdateLeadActivityCommentDto } from './dto/update-lead-activity-comment.dto';

@Controller('lead-activity-comment')
export class LeadActivityCommentController {
  constructor(private readonly leadActivityCommentService: LeadActivityCommentService) {}

  @Post()
  create(@Body() createLeadActivityCommentDto: CreateLeadActivityCommentDto) {
    return this.leadActivityCommentService.create(createLeadActivityCommentDto);
  }

  @Get()
  findAll() {
    return this.leadActivityCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadActivityCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadActivityCommentDto: UpdateLeadActivityCommentDto) {
    return this.leadActivityCommentService.update(+id, updateLeadActivityCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadActivityCommentService.remove(+id);
  }
}
