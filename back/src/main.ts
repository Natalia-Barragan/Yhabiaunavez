import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("Backend iniciando...");

  // CORS configurado con whitelist
  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:3001',
  ];

  if (process.env.NODE_ENV === 'production') {
    allowedOrigins.length = 0;
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
      allowedOrigins.push(frontendUrl);
    }
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The E-Commerce API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();