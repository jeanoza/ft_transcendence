import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteService } from './note.service';
import { LoggedInGuard } from 'src/auth/guard/logged-in.guard';

@Controller('api/note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(LoggedInGuard)
  @Get()
  findAll() {
    return this.noteService.findAll();
  }

  @UseGuards(LoggedInGuard)
  @Post()
  create(@Body() note: CreateNoteDto) {
    return this.noteService.create(note);
  }

  @UseGuards(LoggedInGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.noteService.findOne(id);
  }

  @UseGuards(LoggedInGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() note: UpdateNoteDto) {
    return this.noteService.update(id, note);
  }

  @UseGuards(LoggedInGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.noteService.delete(id);
  }
}
