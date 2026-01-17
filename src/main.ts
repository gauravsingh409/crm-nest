import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/exception-filter';
import { ResponseService } from './common/response.service';

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
    }),
  );

  // global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
