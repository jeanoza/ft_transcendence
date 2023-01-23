import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  @InjectRepository(Note)
  private noteRepository: Repository<Note>;

  async create(note: CreateNoteDto) {
    try {
      await this.noteRepository.save(note);
      return { msg: 'note success' }; //FIXME:or send noteid for redirect on front after receive response
    } catch (e) {
      console.log('note service', e);
      throw new UnauthorizedException();
    }
  }

  async findAll() {
    return await this.noteRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.noteRepository.findOneOrFail({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async delete(id: number) {
    try {
      return await this.noteRepository.softDelete(id);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
