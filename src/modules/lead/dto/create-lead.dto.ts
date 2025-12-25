import { ApiProperty } from '@nestjs/swagger';
import { LeadCategory, LeadService, LeadSource } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsEnum(LeadCategory)
  categories: LeadCategory;

  @IsEnum(LeadService)
  service: LeadService;

  @IsEnum(LeadSource)
  source: LeadSource;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
