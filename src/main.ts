import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.main/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerApp = new Logger('WSERPADMIN');

  // Set the global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS for all routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that do not have decorators
      transform: true, // transform payload to DTO instances
      forbidNonWhitelisted: true, // throw error if payload has properties that do not have decorators
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // security measure to only make available the listed methods
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);
  loggerApp.log(`Application is running on port: ${port}`);
}

// Start the application
void bootstrap();
