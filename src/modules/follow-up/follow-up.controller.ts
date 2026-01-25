import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FollowUpService } from './follow-up.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/constant/permission';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';
import { ResponseService } from 'src/common/response.service';
import { FilterDto } from 'src/common/filter.dto';

@Controller('follow-up')
export class FollowUpController {
  constructor(private readonly followUpService: FollowUpService) { }

  /**
   * Create a new follow-up
   * @param createFollowUpDto 
   * @returns 
   */
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_CREATE)
  async create(@Body() createFollowUpDto: CreateFollowUpDto) {
    const result = await this.followUpService.create(createFollowUpDto);
    return ResponseService.success(result, 'Follow-up created successfully');
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_READ)
  async findAll(@Query() filterDto: FilterDto) {
    const result = await this.followUpService.findAll(filterDto);
    return ResponseService.pagination(result.data, result.meta, "Follow-up fetched successfully");
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_READ)
  async findOne(@Param('id') id: string) {
    const result = await this.followUpService.findOne(id);
    return ResponseService.success(result, 'Follow-up fetched successfully');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_UPDATE)
  async update(@Param('id') id: string, @Body() updateFollowUpDto: UpdateFollowUpDto) {
    const result = await this.followUpService.update(id, updateFollowUpDto);
    return ResponseService.success(result, 'Follow-up updated successfully');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.FOLLOW_UP_DELETE)
  async remove(@Param('id') id: string) {
    const result = await this.followUpService.remove(id);
    return ResponseService.success(result, 'Follow-up deleted successfully');
  }
}
