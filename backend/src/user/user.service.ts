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
    if (ret) return 'ok';
    throw new ForbiddenException();
  }

  findAll() {
    //return this.users;
  }

  async findByEmail(email: string) {
    //with queryBuilder() : do not forget to add table nickname name (ex:'user') for next line(ex:'user.name', 'user.email' etc)!!
    //const res = await this.userRepository
    //  .createQueryBuilder('user')
    //  .where('user.email = :email', { email })
    //  .select(['user.name', 'user.password', 'user.email']) // to add password manually (password is select:false in entity for security)
    //  .getOne();

    //with typeorm method
    const res = await this.userRepository.findOne({
      where: { email },
      select: ['name', 'password', 'email'],
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
