import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Min
} from 'class-validator';
import { ActivityType, CallOutcome } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateLeadActivityDto {
    @IsString()
    @IsNotEmpty()
    // If sending via form-data, ensure this is a valid ID
    leadId: string;

    @IsEnum(ActivityType, {
        message: `type must be one of: ${Object.values(ActivityType).join(', ')}`,
    })
    @IsNotEmpty()
    type: ActivityType;

    @IsEnum(CallOutcome, {
        message: `callOutcome must be one of: ${Object.values(CallOutcome).join(', ')}`,
    })
    @IsOptional()
    callOutcome?: CallOutcome;

    @IsInt()
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => (value ? parseInt(value, 10) : value))
    durationSec?: number;

    @IsString()
    @IsOptional()
    notes?: string;

    // Note: performedById usually comes from the Auth Request (req.user.id)
    // but if you are sending it manually:
    @IsString()
    @IsOptional()
    performedById?: string;
}