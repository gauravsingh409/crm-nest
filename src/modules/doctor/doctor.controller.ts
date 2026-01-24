import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ResponseService } from 'src/common/response.service';
import { FilterDto } from 'src/common/filter.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) { }

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    const doctor = await this.doctorService.create(createDoctorDto);
    return ResponseService.success(doctor, "Doctor created successfully", 201);
  }

  @Get()
  async findAll(@Query() filter: FilterDto) {
    const doctors = await this.doctorService.findAll(filter);
    return ResponseService.success(doctors, "Doctors fetched successfully", 200);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const doctor = this.doctorService.findOne(id);
    return ResponseService.success(doctor, "Doctor fetched successfully", 200);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    const doctor = this.doctorService.update(id, updateDoctorDto);
    return ResponseService.success(doctor, "Doctor updated successfully", 200);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const doctor = this.doctorService.remove(id);
    return ResponseService.success(doctor, "Doctor deleted successfully", 200);
  }
}
