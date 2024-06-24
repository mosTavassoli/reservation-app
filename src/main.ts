import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from 'database/seeders/seeder.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Seed Table
  await app.get(SeederService).seed();

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Reservation API')
    .setDescription('The Reservation API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-api/v1', app, document);

  await app.listen(3000);
}
bootstrap();
