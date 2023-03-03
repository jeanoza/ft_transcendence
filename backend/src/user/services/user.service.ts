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
      rank: 1000,
    });
    if (!ret) throw new ForbiddenException('create failed');

    return ret;
  }

  async findAll() {
    return await this.userRepository
      .createQueryBuilder('users')
      .select(['users.id', 'users.name', 'users.rank'])
      .getMany();
  }

  async findAllByRank() {
    return await this.userRepository
      .createQueryBuilder('users')
      .select(['users.id', 'users.name', 'users.imageURL', 'users.rank'])
      .orderBy('users.rank', 'DESC')
      .getMany();
  }

  //chatSocket: 'UaaDVPB7mhxC6M5_AAAK';
  //createdAt: '2023-03-03T12:38:21.973Z';
  //deletedAt: null;
  //email: 'test@42.fr';
  //id: 3;
  //imageURL: '/default_profile.png';
  //login: null;
  //name: 'test';
  //rank: 1055;
  //status: 1;
  //updatedAt: '2023-03-03T14:11:52.847Z';
  //_2faEnabled: false;
  //_2faSecret: null;
  //[[Prototype]]: Object;

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
      .createQueryBuilder('users')
      .where('lower(users.name) like :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .select(['users.id', 'users.name'])
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
    if (data.name) {
      const user = await this.findByName(data.name);
      if (user) throw new UnauthorizedException('Already exist name');
    }
    return await this.userRepository.update(id, data);
  }
}
