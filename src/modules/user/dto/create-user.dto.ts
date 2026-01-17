import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('NP')
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
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
