import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { join }  from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'production') {
    const CLIENT_FILES = join(__dirname, '..', '..', 'client', 'dist');
    app.use(express.static(CLIENT_FILES));
  }
  await app.listen(process.env.PORT || 4000);
}
bootstrap(); 
