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
    const user = await this.findByEmail(data.email);

    if (user) throw new UnauthorizedException('User already exist');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const ret = await this.userRepository.save({
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });
    if (!ret) throw new ForbiddenException();

    return 'ok';
  }

  findAll() {
    //return this.users;
  }

  async findByEmail(email: string) {
    const res = await this.userRepository.findOne({
      where: { email },
      select: ['name', 'email', 'imageURL'],
    });
    return res;
  }

  findOne(id: number) {
    //const res = this.users.find((el) => el.id === id);
    //if (!res) throw new NotFoundException(`Not found user with id ${id}`);
    //return res;
  }

  update(id: number, data: UpdateUserDto) {
    //this.findOne(id);
    //this.remove(id);
    //this.users.push({ id, ...data });
    //return id;
  }

  remove(id: number) {
    //this.findOne(id);
    //this.users = this.users.filter((el) => el.id !== id);
    //return id;
  }
}
