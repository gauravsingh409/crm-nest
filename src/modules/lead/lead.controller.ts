import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseService } from 'src/common/response.service';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { FilterDto } from 'src/common/filter.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadEntity } from './entities/lead.entity';
import { PERMISSIONS } from '../../constant/permission';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('Leads')
@ApiBearerAuth('access-token')
@Controller('lead')
export class LeadController {
  constructor(private leadService: LeadService) {}

  /**
   * Get all leads with filtering, pagination and search
   * Requires LEAD_READ permission
   */
  @Get('/')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_READ)
  @ApiOperation({
    summary: 'Get all leads',
    description: 'Retrieves a paginated list of leads with optional filtering, searching and sorting',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    example: 'John',
    description: 'Search by first name, last name, email or phone',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    required: false,
    example: '2026-01-26',
    description: 'Filter by specific date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    required: false,
    example: '2026-01-01',
    description: 'Filter by start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    required: false,
    example: '2026-01-31',
    description: 'Filter by end date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    example: 'createdAt',
    description: 'Sort field (default: createdAt)',
  })
  @ApiQuery({
    name: 'order',
    enum: ['asc', 'desc'],
    required: false,
    example: 'desc',
    description: 'Sort order (asc/desc)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Leads fetched successfully',
    isArray: true,
    type: LeadEntity,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async findAll(@Query() filter: FilterDto) {
    const { meta, records } = await this.leadService.findAll(filter);
    return ResponseService.pagination(records, meta);
  }

  /**
   * Get lead details by ID
   * Requires LEAD_READ permission
   */
  @Get('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_READ)
  @ApiOperation({
    summary: 'Get lead details',
    description: 'Retrieves detailed information about a specific lead including owner details',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Lead ID',
    example: 'lead_123abc',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lead details fetched successfully',
    type: LeadEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lead not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async findOne(@Param('id') id: string) {
    const leadDetails = await this.leadService.leadDetails(id);
    return ResponseService.success(
      leadDetails,
      'Lead details successfully retrieved',
      HttpStatus.OK,
    );
  }

  /**
   * Create a new lead
   * Requires LEAD_CREATE permission
   */
  @Post('/')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new lead',
    description: 'Creates a new lead with validation of all required fields',
  })
  @ApiBody({
    type: CreateLeadDto,
    examples: {
      basic: {
        value: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1-800-123-4567',
          email: 'john@example.com',
          whatsapp: '+919876543210',
          categories: 'FERTILITY_PATIENT',
          service: 'IVF',
          source: 'WEBSITE',
          address: '123 Main St, City, Country',
          dob: '1990-05-15T00:00:00Z',
          description: 'Interested in fertility treatments',
          owner: 'user_456',
        },
      },
      minimal: {
        value: {
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+1-800-987-6543',
          email: 'jane@example.com',
          categories: 'FERTILITY_PATIENT',
          service: 'IUI',
          source: 'DOCTOR_REFERRAL',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lead created successfully',
    type: LeadEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A lead with this email already exists',
  })
  async create(@Body() request: CreateLeadDto) {
    const lead = await this.leadService.createLead(request);
    return ResponseService.success(lead, 'Lead created successfully', HttpStatus.CREATED);
  }

  /**
   * Update an existing lead
   * Requires LEAD_UPDATE permission
   */
  @Patch('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_UPDATE)
  @ApiOperation({
    summary: 'Update a lead',
    description: 'Updates an existing lead with partial or complete data',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Lead ID',
    example: 'lead_123abc',
  })
  @ApiBody({
    type: UpdateLeadDto,
    examples: {
      partial: {
        value: {
          phone: '+1-800-999-8888',
          service: 'EGG_FREEZING',
        },
      },
      full: {
        value: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1-800-123-4567',
          email: 'john.updated@example.com',
          categories: 'FERTILITY_PATIENT',
          service: 'IVF',
          source: 'WEBSITE',
          address: '123 Updated St, City, Country',
          dob: '1990-05-15T00:00:00Z',
          description: 'Updated description',
          owner: 'user_789',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lead updated successfully',
    type: LeadEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or validation failed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lead not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A lead with this email already exists',
  })
  async update(@Param('id') id: string, @Body() request: UpdateLeadDto) {
    const lead = await this.leadService.updateLead(id, request);
    return ResponseService.success(lead, 'Lead updated successfully', HttpStatus.OK);
  }

  /**
   * Delete a lead
   * Requires LEAD_DELETE permission
   */
  @Delete('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.LEAD_DELETE)
  @ApiOperation({
    summary: 'Delete a lead',
    description: 'Deletes a specific lead permanently',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Lead ID',
    example: 'lead_123abc',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lead deleted successfully',
    type: LeadEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Lead not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async remove(@Param('id') id: string) {
    const deletedLead = await this.leadService.deleteLead(id);
    return ResponseService.success(
      deletedLead,
      'Lead deleted successfully',
      HttpStatus.OK,
    );
  }
}
