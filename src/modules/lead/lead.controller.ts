import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

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
  async getLeadDetails(@Param('id') id: string) {
    const leadDetails = await this.leadService.leadDetails(id);
    return this.responseService.success(
      leadDetails,
      'Lead details successfully retrived',
      200,
    );
  }

  @Post('/')
  async createLead(@Body() request: CreateLeadDto) {
    const lead = await this.leadService.createLead(request);
    return this.responseService.success(lead, 'Lead created successfully', 201);
  }

  @Patch('/:id')
  async updateLead(@Param('id') id: string, @Body() request: UpdateLeadDto) {
    const lead = await this.leadService.updateLead(id, request);
    return this.responseService.success(lead, 'Lead updated successfully', 200);
  }

  @Delete('/:id')
  async deleteLead(@Param('id') id: string) {
    const deletedLead = await this.leadService.deleteLead(id);
    return this.responseService.success(
      deletedLead,
      'Lead deleted successfully',
      200,
    );
  }
}
