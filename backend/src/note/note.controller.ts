import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';

@Controller('api/note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  findAll() {
    return this.noteService.findAll();
  }
  @Post()
  create(@Body() note) {
    return this.noteService.create(note);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.noteService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.noteService.delete(id);
  }
}
