import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ResponseService } from 'src/common/response.service';
import { FilterDto } from 'src/common/filter.dto';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/common/gaurds/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/constant/permission';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) { }

  /**
   * Create a new branch
   * @param createBranchDto 
   * @returns Promise<Branch>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.BRANCH_CREATE)
  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    const response = await this.branchService.create(createBranchDto);
    return ResponseService.success(response, 'Branch Create successfully', 201);
  }

  /**
   * Get all branches
   * @param pagination 
   * @returns Promise<{ records: Branch[]; meta: MetaData }>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.BRANCH_READ)
  @Get()
  async findAll(@Query() pagination: FilterDto) {
    const { page, limit } = pagination;
    const response = await this.branchService.findAll(page, limit);
    return ResponseService.pagination(response.records, response.meta);
  }

  /**
   * Get branch details
   * @param id 
   * @returns Promise<Branch>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.BRANCH_READ)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const branchDetails = await this.branchService.findOne(id);
    return ResponseService.success(
      branchDetails,
      'Branch details retrieved',
      200,
    );
  }

  /**
   * Update a branch
   * @param id 
   * @param updateBranchDto 
   * @returns Promise<Branch>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.BRANCH_UPDATE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    const updatedBrach = await this.branchService.update(id, updateBranchDto);
    return ResponseService.success(
      updatedBrach,
      'Branch updated successfully',
      200,
    );
  }

  /**
   * Delete a branch
   * @param id 
   * @returns Promise<{ message: string; branch: Branch }>
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.BRANCH_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedBranch = await this.branchService.remove(id);
    return ResponseService.success(
      deletedBranch,
      'Branch deleted successfully',
      200,
    );
  }
}
