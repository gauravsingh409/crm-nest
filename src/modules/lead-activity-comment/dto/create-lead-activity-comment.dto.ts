import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateLeadActivityCommentDto {

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    leadActivityId: string;

    @IsString()
    @IsNotEmpty({ message: 'Comment content cannot be empty' })
    @MinLength(1, { message: 'Comment must be at least 1 character long' })
    @MaxLength(2000, { message: 'Comment is too long (max 2000 characters)' })
    content: string;
}