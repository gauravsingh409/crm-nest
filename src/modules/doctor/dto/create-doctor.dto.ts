import { IsString } from 'class-validator';
import { Exists } from 'src/common/decorators/exists.validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @Exists("branch")
  branch: string;
}
