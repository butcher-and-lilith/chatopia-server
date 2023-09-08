import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api', { exclude: ['docs'] });

  const config = new DocumentBuilder()
    .setTitle('Chatopia API')
    .setDescription('API Documentation of chatopia app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT);
  await app.listen(port);

  console.info(`Chatopia API is running on port: ${port}...`);
}
bootstrap();
