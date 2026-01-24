import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';
import { LeadService } from '@prisma/client';
import { Exists } from 'src/common/decorators/exists.validator';

export class CreateFollowUpDto {

    @IsDateString()
    @IsNotEmpty()
    date_time: string;

    @IsDateString()
    @IsNotEmpty()
    remainder: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(LeadService)
    @IsNotEmpty()
    service: LeadService;

    @IsDateString()
    @IsNotEmpty()
    appointment_date_time: string;

    @IsString()
    @IsNotEmpty()
    @Exists("lead")
    lead_id: string;

    @IsString()
    @IsNotEmpty()
    @Exists("user")
    assignee_id: string;

    @IsString()
    @IsNotEmpty()
    @Exists("branch")
    branch_id: string;

    @IsString()
    @IsNotEmpty()
    @Exists("doctor")
    doctor_id: string;
}
