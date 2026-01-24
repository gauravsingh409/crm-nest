import { IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  branch: string;
}
