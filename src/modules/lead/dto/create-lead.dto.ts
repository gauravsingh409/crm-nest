import { ApiProperty } from '@nestjs/swagger';
import { LeadCategory, LeadService, LeadSource } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({
    example: 'John',
    description: 'Lead first name',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Lead last name',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @ApiProperty({
    example: '+1-800-123-4567',
    description: 'Lead phone number (E.164 format)',
  })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

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
  })
  @IsEnum(LeadCategory, {
    message: `Category must be one of: ${Object.values(LeadCategory).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Category is required' })
  categories: LeadCategory;

  @ApiProperty({
    enum: LeadService,
    example: 'IVF',
    description: 'Service interested in',
    enumName: 'LeadService',
  })
  @IsEnum(LeadService, {
    message: `Service must be one of: ${Object.values(LeadService).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Service is required' })
  service: LeadService;

  @ApiProperty({
    enum: LeadSource,
    example: 'WEBSITE',
    description: 'Source of the lead',
    enumName: 'LeadSource',
  })
  @IsEnum(LeadSource, {
    message: `Source must be one of: ${Object.values(LeadSource).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Source is required' })
  source: LeadSource;

  @ApiProperty({
    example: 'user_456',
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
    example: 'Interested in fertility treatments, prefers evening calls',
    description: 'Additional notes about the lead (optional)',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;
}

