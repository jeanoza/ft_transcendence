import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DMService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async updateUserSocket(socketId: string, userId: number) {
    return await this.userRepository.update(userId, { chatSocket: socketId });
  }
}
