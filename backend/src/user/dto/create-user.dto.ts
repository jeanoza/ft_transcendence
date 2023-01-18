export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  login: string | null;
  imageURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
