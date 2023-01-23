import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
