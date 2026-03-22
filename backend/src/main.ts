
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Bắt buộc để đọc cookie refresh_token
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL, // Thêm URL của frontend trên Railway
    ].filter(Boolean), // Loại bỏ các giá trị undefined/null
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With'
    ],
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true, 
  }));
  await app.listen(3000);
  console.log(` Server running on http://localhost:3000`);
}
bootstrap();