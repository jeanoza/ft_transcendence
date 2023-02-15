import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  logger = new Logger('user service');

  async create(data: CreateUserDto) {
    //user already exist case
    let user = await this.findByEmail(data.email);
    if (user) throw new UnauthorizedException('User already exist');

    //user name already exist
    user = await this.findByName(data.name);
    if (user) throw new UnauthorizedException('User name already exist');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const ret = await this.userRepository.save({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      imageURL: '/default_profile.png',
    });
    if (!ret) throw new ForbiddenException('create failed');

    return ret;
  }

  async findAll() {
    return await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name'])
      .getMany();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'imageURL', '_2faEnabled'], //FIXME: here imageURL or image_url??
    });
  }

  async findByName(name: string) {
    return await this.userRepository.findOne({
      where: { name },
    });
  }

  async findAllByName(name: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('lower(user.name) like :name', { name: `%${name.toLowerCase()}%` })
      .select(['user.id', 'user.name'])
      .getMany();
  }

  async handleDisconnectSocket(chatSocket: string) {
    const user = await this.userRepository.findOne({
      where: { chatSocket },
    });
    if (user) return await this.update(user.id, { status: null });
  }

  async updateStatus(id: number, status: number | null) {
    return await this.userRepository.update(id, { status });
  }

  async update(id: number, data) {
    return await this.userRepository.update(id, data);
  }
}
