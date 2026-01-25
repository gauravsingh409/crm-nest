import { ApiProperty } from '@nestjs/swagger';
import { LeadService } from '@prisma/client';

export class UserProfileEntity {
  @ApiProperty({
    example: 'profile_123',
    description: 'User profile ID',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'First name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
  })
  lastName: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile image URL',
    nullable: true,
  })
  profile?: string;
}

export class UserEntity {
  @ApiProperty({
    example: 'user_123',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: true,
    description: 'Is user active',
  })
  isActive: boolean;

  @ApiProperty({
    type: UserProfileEntity,
    nullable: true,
  })
  profile?: UserProfileEntity;
}

export class BranchEntity {
  @ApiProperty({
    example: 'branch_123',
    description: 'Branch ID',
  })
  id: string;

  @ApiProperty({
    example: 'Main Branch',
    description: 'Branch name',
  })
  name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Branch phone number',
  })
  phone: string;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Branch address',
  })
  address: string;

  @ApiProperty({
    example: 'Main clinic branch',
    description: 'Branch description',
    nullable: true,
  })
  description?: string;
}

export class DoctorEntity {
  @ApiProperty({
    example: 'doctor_123',
    description: 'Doctor ID',
  })
  id: string;

  @ApiProperty({
    example: 'Dr. Sarah Smith',
    description: 'Doctor name',
  })
  name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Doctor phone number',
  })
  phone: string;

  @ApiProperty({
    example: 'branch_123',
    description: 'Associated branch ID',
  })
  branchId: string;
}

export class LeadEntity {
  @ApiProperty({
    example: 'lead_123',
    description: 'Lead ID',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'Lead first name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Lead last name',
  })
  lastName: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Lead phone number',
  })
  phone: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Lead email',
    nullable: true,
  })
  email?: string;

  @ApiProperty({
    example: 'FERTILITY_PATIENT',
    description: 'Lead category',
  })
  categories: string;

  @ApiProperty({
    example: 'IVF',
    description: 'Lead service',
  })
  service: LeadService;

  @ApiProperty({
    example: 'NEW',
    description: 'Lead status',
  })
  status: string;
}

/**
 * Follow-up Entity
 * Represents the structure of a follow-up record in the system
 */
export class FollowUp {
  @ApiProperty({
    example: 'follow_up_123',
    description: 'Follow-up unique identifier',
  })
  id: string;

  @ApiProperty({
    example: '2026-01-25T10:00:00Z',
    description: 'Follow-up scheduled date and time',
  })
  date_time: Date;

  @ApiProperty({
    example: '2026-01-25T09:30:00Z',
    description: 'Reminder notification date and time',
  })
  remainder: Date;

  @ApiProperty({
    example: 'Consultation with specialist',
    description: 'Follow-up title or subject',
  })
  title: string;

  @ApiProperty({
    enum: LeadService,
    example: 'IVF',
    description: 'Associated service type',
  })
  service: LeadService;

  @ApiProperty({
    example: '2026-02-15T14:00:00Z',
    description: 'Scheduled appointment date and time',
  })
  appointment_date_time: Date;

  @ApiProperty({
    example: 'lead_123',
    description: 'Associated lead ID',
  })
  lead_id: string;

  @ApiProperty({
    type: LeadEntity,
    description: 'Associated lead information',
  })
  lead: LeadEntity;

  @ApiProperty({
    example: 'branch_123',
    description: 'Associated branch ID',
  })
  branch_id: string;

  @ApiProperty({
    type: BranchEntity,
    description: 'Associated branch information',
  })
  branch: BranchEntity;

  @ApiProperty({
    example: 'doctor_123',
    description: 'Associated doctor ID',
  })
  doctor_id: string;

  @ApiProperty({
    type: DoctorEntity,
    description: 'Associated doctor information',
  })
  doctor: DoctorEntity;

  @ApiProperty({
    example: 'user_123',
    description: 'ID of the user this follow-up is assigned to',
  })
  assignee_id: string;

  @ApiProperty({
    type: UserEntity,
    description: 'User assigned to this follow-up',
  })
  assignee: UserEntity;

  @ApiProperty({
    example: '2026-01-24T15:30:00Z',
    description: 'Record creation timestamp',
  })
  createdAt: Date;
}
