import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Animal, AnimalSchema } from './entities/animal.entity';
import { Animals, AnimalsSchema } from './schema/animals.schema';

@Module({
  controllers: [AnimalsController],
  providers: [AnimalsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Animal.name,
        schema: AnimalSchema,
      },
      {
        name: Animals.name,
        schema: AnimalsSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class AnimalsModule {}
