import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { LeadService } from '@prisma/client';
import { Exists } from 'src/common/decorators/exists.validator';

export class CreateFollowUpDto {
  @ApiProperty({
    example: '2026-01-25T10:00:00Z',
    description: 'Follow-up date and time (ISO 8601 format)',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Follow-up date and time is required' })
  date_time: string;

  @ApiProperty({
    example: '2026-01-25T09:30:00Z',
    description: 'Reminder date and time (ISO 8601 format)',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Reminder date and time is required' })
  remainder: string;

  @ApiProperty({
    example: 'Consultation with specialist',
    description: 'Follow-up title/subject',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @ApiProperty({
    enum: LeadService,
    example: 'IVF',
    description: 'Lead service type',
  })
  @IsEnum(LeadService, { message: `Service must be one of: ${Object.values(LeadService).join(', ')}` })
  @IsNotEmpty({ message: 'Service is required' })
  service: LeadService;

  @ApiProperty({
    example: '2026-02-15T14:00:00Z',
    description: 'Appointment date and time (ISO 8601 format)',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Appointment date and time is required' })
  appointment_date_time: string;

  @ApiProperty({
    example: 'lead_123abc',
    description: 'Lead ID that this follow-up is associated with',
  })
  @IsString({ message: 'Lead ID must be a string' })
  @IsNotEmpty({ message: 'Lead ID is required' })
  @Exists('lead', { message: 'Lead with this ID does not exist' })
  lead_id: string;

  @ApiProperty({
    example: 'user_456def',
    description: 'User ID of the assigned person',
  })
  @IsString({ message: 'Assignee ID must be a string' })
  @IsNotEmpty({ message: 'Assignee ID is required' })
  @Exists('user', { message: 'User with this ID does not exist' })
  assignee_id: string;

  @ApiProperty({
    example: 'branch_789ghi',
    description: 'Branch ID associated with this follow-up',
  })
  @IsString({ message: 'Branch ID must be a string' })
  @IsNotEmpty({ message: 'Branch ID is required' })
  @Exists('branch', { message: 'Branch with this ID does not exist' })
  branch_id: string;

  @ApiProperty({
    example: 'doctor_012jkl',
    description: 'Doctor ID associated with this follow-up',
  })
  @IsString({ message: 'Doctor ID must be a string' })
  @IsNotEmpty({ message: 'Doctor ID is required' })
  @Exists('doctor', { message: 'Doctor with this ID does not exist' })
  doctor_id: string;
}
