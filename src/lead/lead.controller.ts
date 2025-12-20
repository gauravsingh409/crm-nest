import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('lead')
export class LeadController {
  constructor(
    private leadService: LeadService,
    private responseService: ResponseService,
  ) {}

  @Get('/')
  async getAllLead(@Query() pagination: PaginationDto) {
    const { meta, records } = await this.leadService.getAllLead(pagination);
    return this.responseService.pagination(records, meta);
  }

  @Get('/:id')
  async getLeadDetails() {}

  @Post('/')
  async createLead(@Body() request: CreateLeadDto) {
    const lead = await this.leadService.createLead(request);
    return this.responseService.success(lead, 'Lead created successfully', 201);
  }

  @Patch('/')
  async updateLead() {}

  @Delete()
  async deleteLead() {}
}
