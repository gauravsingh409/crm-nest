import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { LeadService } from '@prisma/client';
import { Exists } from 'src/common/decorators/exists.validator';

export class UpdateFollowUpDto {
  @ApiProperty({
    example: '2026-01-25T10:00:00Z',
    description: 'Follow-up date and time (ISO 8601 format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date_time?: string;

  @ApiProperty({
    example: '2026-01-25T09:30:00Z',
    description: 'Reminder date and time (ISO 8601 format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  remainder?: string;

  @ApiProperty({
    example: 'Updated consultation title',
    description: 'Follow-up title/subject',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title?: string;

  @ApiProperty({
    enum: LeadService,
    example: 'IUI',
    description: 'Lead service type',
    required: false,
  })
  @IsOptional()
  @IsEnum(LeadService, { message: `Service must be one of: ${Object.values(LeadService).join(', ')}` })
  service?: LeadService;

  @ApiProperty({
    example: '2026-02-15T14:00:00Z',
    description: 'Appointment date and time (ISO 8601 format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  appointment_date_time?: string;

  @ApiProperty({
    example: 'lead_123abc',
    description: 'Lead ID that this follow-up is associated with',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Lead ID must be a string' })
  @Exists('lead', { message: 'Lead with this ID does not exist' })
  lead_id?: string;

  @ApiProperty({
    example: 'user_456def',
    description: 'User ID of the assigned person',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Assignee ID must be a string' })
  @Exists('user', { message: 'User with this ID does not exist' })
  assignee_id?: string;

  @ApiProperty({
    example: 'branch_789ghi',
    description: 'Branch ID associated with this follow-up',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Branch ID must be a string' })
  @Exists('branch', { message: 'Branch with this ID does not exist' })
  branch_id?: string;

  @ApiProperty({
    example: 'doctor_012jkl',
    description: 'Doctor ID associated with this follow-up',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Doctor ID must be a string' })
  @Exists('doctor', { message: 'Doctor with this ID does not exist' })
  doctor_id?: string;
}
