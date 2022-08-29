import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, ObjectId } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private readonly animalModel: Model<Animal>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto) {
    createAnimalDto.typeAnimal = createAnimalDto.typeAnimal.toLocaleUpperCase();
    createAnimalDto.typeDevice = createAnimalDto.typeDevice.toLocaleUpperCase();
    try {
      const createdAnimal = await this.animalModel.create(createAnimalDto);
      return createdAnimal;
    } catch (error) {
      if (error.code === 11000) {
        this.handleExceptions(error);
      }
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = 0 } = paginationDto;
    try {
      const listAnimals = await this.animalModel
        .find({})
        .limit(limit)
        .skip(offset)
        .sort({
          createdAt: -1, //order by createdAt desc
        })
        // .select('-__v'); // '-__v' select only the fields that we want to show
        .select({ __v: 0, _id: 0 }); // '-__v' select only the fields that we want to show
      const data = {
        animals: listAnimals,
      };
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error finding animals - check server log',
      );
    }
  }

  async findOne(search: string) {
    let animal: Animal;
    try {
      //weight
      if (!isNaN(+search))
        animal = await this.animalModel.findOne({
          weight: +search,
          is_active: true,
        });
      //MongoId
      if (isValidObjectId(search)) {
        animal = await this.animalModel.findById(search);
        if (!animal.is_active) animal = null;
      }

      //idSenasa
      if (!animal)
        animal = await this.animalModel.findOne({
          idSenasa: search,
          is_active: true,
        });
      //idDevice
      if (search.length === 8)
        animal = await this.animalModel.findOne({
          idDevice: search,
          is_active: true,
        });
      if (!animal) throw new NotFoundException(`Animal not found`);

      return animal;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error finding animals - check server log',
      );
    }
  }

  async update(id: ObjectId, updateAnimalDto: UpdateAnimalDto) {
    let animal: Animal;
    try {
      if (isValidObjectId(id))
        animal = await this.animalModel.findByIdAndUpdate(id, updateAnimalDto, {
          new: true,
        });

      if (updateAnimalDto.typeAnimal)
        animal.typeAnimal = updateAnimalDto.typeAnimal.toLocaleUpperCase();
      if (updateAnimalDto.typeDevice)
        animal.typeDevice = updateAnimalDto.typeDevice.toLocaleUpperCase();

      return animal;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: ObjectId) {
    try {
      const { deletedCount } = await this.animalModel.deleteOne({ _id: id });
      if (deletedCount === 0)
        throw new NotFoundException(`Animal with id ${id} not found`);
      return 'Animal deleted';
      // if (isValidObjectId(id)) {
      // let animal: Animal;
      //   animal = await this.animalModel.findByIdAndUpdate(
      //     id,
      //     { is_active: false },
      //     {
      //       new: true,
      //     },
      //   );

      //   return animal;
      // }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Animal already exists ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      'Error creating animal - check server log',
    );
  }
}
