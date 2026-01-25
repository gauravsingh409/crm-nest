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
import { FollowUpService } from './follow-up.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { FollowUp } from './entities/follow-up.entity';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/constant/permission';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';
import { ResponseService } from 'src/common/response.service';
import { FilterDto } from 'src/common/filter.dto';

@ApiTags('Follow-ups')
@ApiBearerAuth('access-token')
@Controller('follow-up')
export class FollowUpController {
  constructor(private readonly followUpService: FollowUpService) {}

  /**
   * Create a new follow-up
   * Requires FOLLOW_UP_CREATE permission
   */
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new follow-up',
    description: 'Creates a new follow-up with validation of all related entities',
  })
  @ApiBody({
    type: CreateFollowUpDto,
    examples: {
      basic: {
        value: {
          title: 'Consultation with specialist',
          date_time: '2026-01-25T10:00:00Z',
          remainder: '2026-01-25T09:30:00Z',
          appointment_date_time: '2026-02-15T14:00:00Z',
          service: 'IVF',
          lead_id: 'lead_123',
          assignee_id: 'user_456',
          branch_id: 'branch_789',
          doctor_id: 'doctor_012',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Follow-up created successfully',
    type: FollowUp,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or validation failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async create(@Body() createFollowUpDto: CreateFollowUpDto) {
    const result = await this.followUpService.create(createFollowUpDto);
    return ResponseService.success(
      result,
      'Follow-up created successfully',
      HttpStatus.CREATED
    );
  }

  /**
   * Get all follow-ups with filtering and pagination
   * Requires FOLLOW_UP_READ permission
   */
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_READ)
  @ApiOperation({
    summary: 'Get all follow-ups',
    description:
      'Retrieves a paginated list of follow-ups with optional filtering',
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
    example: 'consultation',
    description: 'Search by title or lead name',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    required: false,
    example: '2026-01-25',
    description: 'Filter by specific date',
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    required: false,
    example: '2026-01-01',
    description: 'Filter by start date',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    required: false,
    example: '2026-01-31',
    description: 'Filter by end date',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    example: 'createdAt',
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'order',
    enum: ['asc', 'desc'],
    required: false,
    example: 'desc',
    description: 'Sort order',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Follow-ups fetched successfully',
    isArray: true,
    type: FollowUp,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async findAll(@Query() filterDto: FilterDto) {
    const result = await this.followUpService.findAll(filterDto);
    return ResponseService.pagination(
      result.data,
      result.meta,
      'Follow-ups fetched successfully'
    );
  }

  /**
   * Get a single follow-up by ID
   * Requires FOLLOW_UP_READ permission
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_READ)
  @ApiOperation({
    summary: 'Get a follow-up by ID',
    description: 'Retrieves detailed information about a specific follow-up',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Follow-up ID',
    example: 'follow_up_123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Follow-up fetched successfully',
    type: FollowUp,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Follow-up not found',
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
    const result = await this.followUpService.findOne(id);
    return ResponseService.success(result, 'Follow-up fetched successfully');
  }

  /**
   * Update a follow-up
   * Requires FOLLOW_UP_UPDATE permission
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_UPDATE)
  @ApiOperation({
    summary: 'Update a follow-up',
    description:
      'Updates an existing follow-up with partial or complete data',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Follow-up ID',
    example: 'follow_up_123',
  })
  @ApiBody({
    type: UpdateFollowUpDto,
    examples: {
      partial: {
        value: {
          title: 'Updated consultation title',
        },
      },
      full: {
        value: {
          title: 'Updated consultation title',
          date_time: '2026-01-25T10:00:00Z',
          remainder: '2026-01-25T09:30:00Z',
          appointment_date_time: '2026-02-15T14:00:00Z',
          service: 'IUI',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Follow-up updated successfully',
    type: FollowUp,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or validation failed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Follow-up not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFollowUpDto: UpdateFollowUpDto
  ) {
    const result = await this.followUpService.update(id, updateFollowUpDto);
    return ResponseService.success(result, 'Follow-up updated successfully');
  }

  /**
   * Delete a follow-up
   * Requires FOLLOW_UP_DELETE permission
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_DELETE)
  @ApiOperation({
    summary: 'Delete a follow-up',
    description: 'Deletes a specific follow-up permanently',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Follow-up ID',
    example: 'follow_up_123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Follow-up deleted successfully',
    type: FollowUp,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Follow-up not found',
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
    const result = await this.followUpService.remove(id);
    return ResponseService.success(result, 'Follow-up deleted successfully');
  }
}
