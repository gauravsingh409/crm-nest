import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/constant/permission';
import { ResponseService } from 'src/common/response.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }


  /**
   * Create a new role
   * @param createRoleDto 
   * @returns Promise<Role>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLE_CREATE)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return ResponseService.success(role, 'Role created successfully', 201);
  }

  /**
   * Get all roles
   * @returns Promise<Role[]>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLE_READ)
  @Get()
  async findAll() {
    const roles = await this.roleService.findAll();
    return ResponseService.success(roles, 'Roles fetched successfully', 200);
  }

  /**
   * Get a single role by id
   * @param id 
   * @returns Promise<Role>
   */

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLE_READ)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findOne(id);
    return ResponseService.success(role, 'Role fetched successfully', 200);
  }

  /**
   * Update a role by id
   * @param id 
   * @param updateRoleDto 
   * @returns Promise<Role>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLE_UPDATE)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.update(id, updateRoleDto);
    return ResponseService.success(role, 'Role updated successfully', 200);
  }


  /**
   * Delete a role by id
   * @param id 
   * @returns Promise<Role>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.ROLE_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const role = await this.roleService.remove(id);
    return ResponseService.success(role, 'Role deleted successfully', 200);
  }
}
