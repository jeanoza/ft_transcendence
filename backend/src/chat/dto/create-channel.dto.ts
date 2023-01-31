import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsString()
  password?: string;

  @IsBoolean()
  isPublic: boolean;

  //createdAt?: Date;
  //updatedAt?: Date;
  //deletedAt?: Date | null;
}
