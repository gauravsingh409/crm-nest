import { ApiProperty } from '@nestjs/swagger';
import { LeadCategory, LeadService, LeadSource } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateLeadDto {
  @ApiProperty({
    example: 'John',
    description: 'Lead first name',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Lead last name',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName?: string;

  @ApiProperty({
    example: '+1-800-123-4567',
    description: 'Lead phone number (E.164 format)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Lead email address',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiProperty({
    example: '+919876543210',
    description: 'Lead WhatsApp number (optional)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'WhatsApp must be a string' })
  @MaxLength(20, { message: 'WhatsApp number must not exceed 20 characters' })
  whatsapp?: string;

  @ApiProperty({
    enum: LeadCategory,
    example: 'FERTILITY_PATIENT',
    description: 'Lead category classification',
    enumName: 'LeadCategory',
    required: false,
  })
  @IsOptional()
  @IsEnum(LeadCategory, {
    message: `Category must be one of: ${Object.values(LeadCategory).join(', ')}`,
  })
  categories?: LeadCategory;

  @ApiProperty({
    enum: LeadService,
    example: 'IUI',
    description: 'Service interested in',
    enumName: 'LeadService',
    required: false,
  })
  @IsOptional()
  @IsEnum(LeadService, {
    message: `Service must be one of: ${Object.values(LeadService).join(', ')}`,
  })
  service?: LeadService;

  @ApiProperty({
    enum: LeadSource,
    example: 'FACEBOOK',
    description: 'Source of the lead',
    enumName: 'LeadSource',
    required: false,
  })
  @IsOptional()
  @IsEnum(LeadSource, {
    message: `Source must be one of: ${Object.values(LeadSource).join(', ')}`,
  })
  source?: LeadSource;

  @ApiProperty({
    example: 'user_789',
    description: 'ID of the assigned owner (optional)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Owner ID must be a string' })
  owner?: string;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Lead address (optional)',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(500, { message: 'Address must not exceed 500 characters' })
  address?: string;

  @ApiProperty({
    example: '1990-05-15T00:00:00Z',
    description: 'Date of birth in ISO 8601 format (optional)',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid ISO 8601 date string' }
  )
  dob?: string;

  @ApiProperty({
    example: 'Updated notes about the lead',
    description: 'Additional notes about the lead (optional)',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;
}

