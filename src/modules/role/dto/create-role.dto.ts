import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsNotEmpty()
    permissions: string[];
}
