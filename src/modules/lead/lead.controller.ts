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
import { PERMISSIONS } from '../../constant/permission';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateLeadActivityDto } from './dto/create-lead-activity.dto';
import { UpdateLeadActivityDto } from './dto/update-lead-activity.dto';

@Controller('lead')
@ApiTags('Leads')
export class LeadController {
  constructor(private leadService: LeadService) { }

  /**
   * Get all leads
   * @param pagination 
   * @returns Promise<{ records: Lead[]; meta: MetaData }>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_READ)
  @Get('/')
  async findAll(@Query() pagination: PaginationDto) {
    const { meta, records } = await this.leadService.findAll(pagination);
    return ResponseService.pagination(records, meta);
  }

  /**
   * Get lead details
   * @param id 
   * @returns Promise<Lead>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_READ)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const leadDetails = await this.leadService.leadDetails(id);
    return ResponseService.success(
      leadDetails,
      'Lead details successfully retrived',
      200,
    );
  }

  /**
   * Create a new lead
   * @param request 
   * @returns Promise<Lead>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_CREATE)
  @Post('/')
  @ApiBody({ type: CreateLeadDto })
  @ApiResponse({
    status: 201,
    description: 'Lead created successfully',
    type: CreateLeadDto,
  })
  @Permissions(PERMISSIONS.LEAD_CREATE)
  async create(@Body() request: CreateLeadDto) {
    const lead = await this.leadService.createLead(request);
    return ResponseService.success(lead, 'Lead created successfully', 201);
  }

  /**
   * Update a lead
   * @param id 
   * @param request 
   * @returns Promise<Lead>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_UPDATE)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() request: UpdateLeadDto) {
    const lead = await this.leadService.updateLead(id, request);
    return ResponseService.success(lead, 'Lead updated successfully', 200);
  }


  /**
   * Delete a lead
   * @param id 
   * @returns Promise<{ message: string; lead: Lead }>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_DELETE)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const deletedLead = await this.leadService.deleteLead(id);
    return ResponseService.success(
      deletedLead,
      'Lead deleted successfully',
      200,
    );
  }

  /**
   * =========================================================================
   *                          Lead Activity
   * =========================================================================
   */

  /**
   * Get all lead activities
   * @param pagination 
   * @returns Promise<{ records: LeadActivity[]; meta: MetaData }>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_READ)
  @Get('/activity')
  async findAllLeadActivity(@Query() pagination: PaginationDto) {
    const { page, limit } = pagination;
    const response = await this.leadService.findAllLeadActivity({
      page,
      limit,
    });
    return ResponseService.pagination(response.records, response.meta);
  }

  /**
   * Get lead activity details
   * @param id 
   * @returns Promise<LeadActivity>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_READ)
  @Get('/activity/:id')
  async findOneLeadActivity(@Param('id') id: string) {
    const leadActivityDetails = await this.leadService.findOneLeadActivity(id);
    return ResponseService.success(
      leadActivityDetails,
      'Lead activity details successfully retrived',
      200,
    );
  }

  /**
   * Create a new lead activity
   * @param request 
   * @returns Promise<LeadActivity>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_CREATE)
  @Post('/activity')
  @ApiBody({ type: CreateLeadActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Lead activity created successfully',
    type: CreateLeadActivityDto,
  })
  async createLeadActivity(@Body() request: CreateLeadActivityDto) {
    const leadActivity = await this.leadService.createLeadActivity(request);
    return ResponseService.success(
      leadActivity,
      'Lead activity created successfully',
      201,
    );
  }

  /**
   * Update a lead activity
   * @param id 
   * @param request 
   * @returns Promise<LeadActivity>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_UPDATE)
  @Patch('/activity/:id')
  async updateLeadActivity(@Param('id') id: string, @Body() request: UpdateLeadActivityDto) {
    const leadActivity = await this.leadService.updateLeadActivity(id, request);
    return ResponseService.success(
      leadActivity,
      'Lead activity updated successfully',
      200,
    );
  }

  /**
   * Delete a lead activity
   * @param id 
   * @returns Promise<{ message: string; leadActivity: LeadActivity }>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_DELETE)
  @Delete('/activity/:id')
  async removeLeadActivity(@Param('id') id: string) {
    const deletedLeadActivity = await this.leadService.removeLeadActivity(id);
    return ResponseService.success(
      deletedLeadActivity,
      'Lead activity deleted successfully',
      200,
    );
  }
}
