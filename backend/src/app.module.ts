import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';
import { Note } from './note/entities/note.entity';
import { ChatModule } from './chat/chat.module';
import { Channel } from './chat/entities/channel.entity';
import { ChannelMember } from './chat/entities/channelMember.entity';
import { ChannelChat } from './chat/entities/channelChat.entity';
import { Friend } from './user/entities/friend.entity';
import { Blocked } from './user/entities/blocked.entity';
import { AppController } from './app.controller';
import { DM } from './chat/entities/dm.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true, // 'true' at the first time then 'false' to do not lose data
      entities: [
        User,
        Note,
        Channel,
        ChannelMember,
        ChannelChat,
        Friend,
        Blocked,
        DM,
      ],
      //logging: process.env.NODE_ENV !== 'production', // logging only on dev
      logging: false, // logging only on dev
      keepConnectionAlive: true, //hot-reloading disconnect db when code change
    }),
    UserModule,
    AuthModule,
    NoteModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
