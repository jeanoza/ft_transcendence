import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteService } from './note.service';

@Controller('api/note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  findAll() {
    return this.noteService.findAll();
  }
  @Post()
  create(@Body() note: CreateNoteDto) {
    return this.noteService.create(note);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.noteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() note: UpdateNoteDto) {
    return this.noteService.update(id, note);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.noteService.delete(id);
  }
}
