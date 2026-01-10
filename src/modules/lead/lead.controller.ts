import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResponseService } from 'src/common/response.service';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PERMISSIONS } from '../permission/permission';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';

@Controller('lead')
@ApiTags('Leads')
export class LeadController {
  constructor(private leadService: LeadService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('/')
  async findAll(@Query() pagination: PaginationDto) {
    const { meta, records } = await this.leadService.getAllLead(pagination);
    return ResponseService.pagination(records, meta);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const leadDetails = await this.leadService.leadDetails(id);
    return ResponseService.success(
      leadDetails,
      'Lead details successfully retrived',
      200,
    );
  }

  @Post('/')
  @ApiBody({ type: CreateLeadDto })
  @ApiResponse({
    status: 201,
    description: 'Lead created successfully',
    type: CreateLeadDto,
  })
  async create(@Body() request: CreateLeadDto) {
    const lead = await this.leadService.createLead(request);
    return ResponseService.success(lead, 'Lead created successfully', 201);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() request: UpdateLeadDto) {
    const lead = await this.leadService.updateLead(id, request);
    return ResponseService.success(lead, 'Lead updated successfully', 200);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const deletedLead = await this.leadService.deleteLead(id);
    return ResponseService.success(
      deletedLead,
      'Lead deleted successfully',
      200,
    );
  }
}
