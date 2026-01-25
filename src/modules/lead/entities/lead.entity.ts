import { ApiProperty } from '@nestjs/swagger';
import { LeadCategory, LeadService, LeadSource, LeadStatus } from '@prisma/client';

export class UserProfileEntity {
  @ApiProperty({
    example: 'profile_123',
    description: 'User profile ID',
  })
  id: string;

  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    example: '+1234567890',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  profile?: string;
}

export class UserEntity {
  @ApiProperty({
    example: 'user_123',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: UserProfileEntity,
    nullable: true,
  })
  profile?: UserProfileEntity;
}

export class LeadEntity {
  @ApiProperty({
    example: 'lead_123',
    description: 'Lead unique identifier',
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
    description: 'Lead email address',
    nullable: true,
  })
  email?: string;

  @ApiProperty({
    example: '+919876543210',
    description: 'Lead WhatsApp number',
    nullable: true,
  })
  whatsapp?: string;

  @ApiProperty({
    enum: LeadCategory,
    example: 'FERTILITY_PATIENT',
    description: 'Lead category classification',
  })
  categories: LeadCategory;

  @ApiProperty({
    enum: LeadService,
    example: 'IVF',
    description: 'Service interested in',
  })
  service: LeadService;

  @ApiProperty({
    enum: LeadSource,
    example: 'WEBSITE',
    description: 'Source of the lead',
  })
  source: LeadSource;

  @ApiProperty({
    enum: LeadStatus,
    example: 'NEW',
    description: 'Current status of the lead',
  })
  status: LeadStatus;

  @ApiProperty({
    example: 'user_456',
    description: 'ID of the assigned owner',
    nullable: true,
  })
  ownerId?: string;

  @ApiProperty({
    type: UserEntity,
    description: 'Assigned owner details',
    nullable: true,
  })
  owner?: UserEntity;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Lead address',
    nullable: true,
  })
  address?: string;

  @ApiProperty({
    example: '1990-05-15T00:00:00Z',
    description: 'Date of birth',
    nullable: true,
  })
  dob?: Date;

  @ApiProperty({
    example: 'Interested in fertility treatments',
    description: 'Additional notes about the lead',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    example: '2026-01-26T10:00:00Z',
    description: 'Record creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-26T10:00:00Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
