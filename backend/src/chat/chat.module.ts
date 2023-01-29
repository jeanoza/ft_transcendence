import { Module } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
})
export class ChatModule {}
