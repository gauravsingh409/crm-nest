import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';
import { LeadService } from '@prisma/client';

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
    lead_id: string;

    @IsString()
    @IsNotEmpty()
    assignee_id: string;

    @IsString()
    @IsNotEmpty()
    branch_id: string;

    @IsString()
    @IsNotEmpty()
    doctor_id: string;
}
