import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

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

  //update(id: number, data: UpdateUserDto) {}

  //remove(id: number) {}
}
