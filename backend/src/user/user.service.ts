import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];
  create(data: CreateUserDto): number {
    let max = 0;
    this.users.forEach((el) => {
      if (max < el.id) max = el.id;
    });
    const id = max + 1;

    this.users.push({ id, ...data });
    return id;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const res = this.users.find((el) => el.id === id);
    if (!res) throw new NotFoundException(`Not found user with id ${id}`);
    return res;
  }

  update(id: number, data: UpdateUserDto): number {
    this.findOne(id);
    this.remove(id);
    this.users.push({ id, ...data });
    return id;
  }

  remove(id: number): number {
    this.findOne(id);
    this.users = this.users.filter((el) => el.id !== id);
    return id;
  }
}
