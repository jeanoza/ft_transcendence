import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: 'secret', //TODO: to replace with token such as 'ASDF21312fasdf',
      cookie: {
        httpOnly: true,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 8888;
  await app.listen(port);
  console.log(`Backend Server listen to ${port}`);
}
bootstrap();
