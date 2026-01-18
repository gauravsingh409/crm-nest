import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PaginationDto } from 'src/common/filter.dto';
import { ResponseService } from 'src/common/response.service';
import { PERMISSIONS } from 'src/constant/permission';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }


  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.PERMISSION_READ)
  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { meta, records } = await this.permissionService.findAll(pagination)
    return ResponseService.pagination(records, meta)
  }

}
