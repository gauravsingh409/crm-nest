import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
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
    description: 'User last name',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: '+977-9841234567',
    description: 'User phone number (Nepal format)',
    required: false,
  })
  @IsPhoneNumber('NP', { message: 'Phone number must be in valid Nepal format' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'SecurePass@123',
    description: 'User password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    example: ['role_123', 'role_456'],
    description: 'Array of role IDs to assign to user',
    type: [String],
    isArray: true,
  })
  @IsArray({ message: 'Roles must be an array' })
  @IsString({ each: true, message: 'Each role must be a string' })
  @IsNotEmpty({ each: true, message: 'Role IDs cannot be empty' })
  /** * Form-data arrives as a string if there's only one item.
   * This logic ensures it is always an array for @IsArray() to pass.
   */
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // If it looks like a JSON string "['role1']", parse it, 
      // otherwise wrap the plain string in an array.
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return value;
  })
  role: string[];
}
