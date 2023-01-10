import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8888;

  app.enableCors();

  await app.listen(port);
  console.log(`Backend Server listen to ${port}`);
}
bootstrap();
