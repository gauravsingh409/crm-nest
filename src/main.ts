import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/exception-filter';
import { ResponseService } from './common/response.service';
import { ValidationExceptionFilter } from './common/validation-exception.filter';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.createMicroservice(AppModule);

  // Api Documentation
  const config = new DocumentBuilder()
    .setTitle('CRM')
    .setDescription('Api documentation for the CRM')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // Strips properties without decorators
      forbidNonWhitelisted: true,    // Throws error if non-decorated props exist
      transform: true,               // Automatically transforms payloads to DTO instances
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errors: { path: string; message: string }[] = [];
        console.log(validationErrors)
        validationErrors.forEach((err) => {
          const constraints = Object.values(err.constraints ?? {});
          constraints.forEach((message: string) => {
            errors.push({
              path: err.property,
              message: message,
            });
          });
        });
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  // global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(), new ValidationExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
