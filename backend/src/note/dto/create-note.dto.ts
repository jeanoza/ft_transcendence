import { IsInt, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsInt()
  authorId: number;

  //createdAt?: Date;
  //updatedAt?: Date;
  //deletedAt?: Date | null;
}
