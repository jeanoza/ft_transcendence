import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  @InjectRepository(Note)
  private noteRepository: Repository<Note>;

  async create(note: CreateNoteDto) {
    return await this.noteRepository.save(note).catch((e) => {
      console.log(e);
      throw new UnauthorizedException();
    });
  }

  async findAll() {
    return await this.noteRepository.find();
  }

  async findOne(id: number) {
    return await this.noteRepository
      .findOneOrFail({ where: { id } })
      .catch((e) => {
        console.log(e);
        throw new NotFoundException();
      });
  }

  async delete(id: number) {
    await this.findOne(id);
    return await this.noteRepository.softDelete(id).catch((e) => {
      console.log(e);
      throw new UnauthorizedException();
    });
  }

  async update(id: number, note: UpdateNoteDto) {
    await this.findOne(id);
    try {
      await this.noteRepository.update(id, { ...note });
      return { msg: 'updated' };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
