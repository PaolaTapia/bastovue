import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.animalsService.findAll(paginationDto);
  }

  @Get(':search')
  findOne(@Param('search') search: string) {
    return this.animalsService.findOne(search); // +id: lo conviertiría a number si en service recibe id como number
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseMongoIdPipe) id: ObjectId,
    @Body() updateAnimalDto: UpdateAnimalDto,
  ) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseMongoIdPipe) id: ObjectId) {
    return this.animalsService.remove(id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  removeMany(@Body() search: ObjectId[]) {
    return this.animalsService.removeMany(search);
  }
}
