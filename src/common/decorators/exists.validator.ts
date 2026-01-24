import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust path
import { PrismaClient } from '@prisma/client';

@ValidatorConstraint({ name: 'Exists', async: true })
@Injectable()
export class ExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) { }

    async validate(value: any, args: ValidationArguments) {
        if (!value) return false;

        const [modelName] = args.constraints;
        // Prisma models are usually lowercase in the client (e.g., prisma.user)
        const model = modelName.toLowerCase();

        try {
            const record = await (this.prisma as any)[model].findUnique({
                where: { id: value },
            });
            return !!record; // Returns true if record exists
        } catch (e) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} with ID ${args.value} does not exist in ${args.constraints[0]}`;
    }

}

// The Decorator Function
export function Exists(model: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [model],
            validator: ExistsConstraint,
        });
    };
}