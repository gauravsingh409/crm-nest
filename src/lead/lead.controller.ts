import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { LeadService } from './lead.service';

@Controller('lead')
export class LeadController {
  constructor(
    private leadService: LeadService,
    private responseService: ResponseService,
  ) {}

  @Get('/')
  async getAllLead() {}

  @Get('/:id')
  async getLeadDetails() {}

  @Post('/')
  async createLead() {}

  @Patch('/')
  async updateLead() {}

  @Delete()
  async deleteLead() {}
}
