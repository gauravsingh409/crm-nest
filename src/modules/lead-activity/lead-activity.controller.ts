import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LeadActivityService } from './lead-activity.service';
import { CreateLeadActivityDto } from './dto/create-lead-activity.dto';
import { UpdateLeadActivityDto } from './dto/update-lead-activity.dto';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';
import { PERMISSIONS } from 'src/constant/permission';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResponseService } from 'src/common/response.service';
import { PaginationDto } from 'src/common/filter.dto';

@Controller('lead-activity')
export class LeadActivityController {
  constructor(private readonly leadActivityService: LeadActivityService) { }

  /**
   * Create a new lead activity
   * @param request 
   * @returns Promise<LeadActivity>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_CREATE)
  @Post()
  @ApiBody({ type: CreateLeadActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Lead activity created successfully',
    type: CreateLeadActivityDto,
  })
  async create(@Body() request: CreateLeadActivityDto) {
    const leadActivity = await this.leadActivityService.create(request);
    return ResponseService.success(
      leadActivity,
      'Lead activity created successfully',
      201,
    );
  }

  /**
   * Get all lead activities
   * @param pagination 
   * @returns Promise<{ records: LeadActivity[]; meta: MetaData }>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_READ)
  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { meta, records } = await this.leadActivityService.findAll(pagination);
    return ResponseService.pagination(records, meta);
  }

  /**
   * Get lead activity details
   * @param id 
   * @returns Promise<LeadActivity>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_READ)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const leadActivityDetails = await this.leadActivityService.findOne(id);
    return ResponseService.success(
      leadActivityDetails,
      'Lead activity details successfully retrived',
      200,
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
  @Patch(':id')
  async update(@Param('id') id: string, @Body() request: UpdateLeadActivityDto) {
    const leadActivity = await this.leadActivityService.update(id, request);
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
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedLeadActivity = await this.leadActivityService.remove(id);
    return ResponseService.success(
      deletedLeadActivity,
      'Lead activity deleted successfully',
      200,
    );
  }
}
