import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'john.updated@example.com',
    description: 'User email address (must be unique)',
    required: false,
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+977-9841234567',
    description: 'User phone number (Nepal format)',
    required: false,
  })
  @IsPhoneNumber('NP', { message: 'Phone number must be in valid Nepal format' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'NewSecurePass@456',
    description: 'New user password (minimum 6 characters)',
    minLength: 6,
    required: false,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: ['role_123', 'role_456'],
    description: 'Array of role IDs to assign to user (replaces existing roles)',
    type: [String],
    isArray: true,
    required: false,
  })
  @IsArray({ message: 'Roles must be an array' })
  @IsString({ each: true, message: 'Each role must be a string' })
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsOptional()
  role?: string[];
}

