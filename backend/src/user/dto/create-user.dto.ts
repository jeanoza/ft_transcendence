export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  login: string;
  imageURL: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
