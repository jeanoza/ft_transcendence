import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    //TypeOrmModule.forRoot({
    //  type: 'postgres',
    //  host: 'localhost',
    //  port: 5432,
    //  //username: process.env.DB_USERNAME,
    //  //password: process.env.DB_PASSWORD,
    //  database: process.env.DB_DATABASE,
    //  synchronize: true, // 'true' at the first time then 'false' to do not lose data
    //  entities: [User],
    //  logging: process.env.NODE_ENV !== 'production', // logging only on dev
    //  keepConnectionAlive: true, //hot-reloading disconnect db when code change
    //}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
