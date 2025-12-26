import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ResponseService } from 'src/common/response/response.service';

@Controller('branch')
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private responseService: ResponseService,
  ) {}

  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    const response = await this.branchService.create(createBranchDto);
    return this.responseService.success(
      response,
      'Branch Create successfully',
      201,
    );
  }

  @Get()
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchService.remove(+id);
  }
}
