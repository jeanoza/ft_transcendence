import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  //login: string;
  //imageURL: string;
  //createdAt?: Date;
  //updatedAt?: Date;
  //deletedAt?: Date | null;
}
