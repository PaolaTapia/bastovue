import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Animal } from 'src/animals/entities/animal.entity';
import { IResponseAnimal } from './interfaces/IResponseAnimal';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Animal.name) private readonly animalModel: Model<Animal>,
  ) {}

  async excecuteSeed() {
    await this.animalModel.deleteMany({});
    const animals: IResponseAnimal[] = [];
    const { data } = await this.axios.get<IResponseAnimal[]>(
      'https://62e8220593938a545be105ae.mockapi.io/api/v1/Animal',
    );
    data.forEach(async (element) => {
      const nIdSenasa = element.idSenasa.slice(0, 16);
      const nweight = element.weight * 10;
      element = { ...element, idSenasa: nIdSenasa, weight: nweight };
      animals.push(element);
      //si quiero crear uno por uno en la BD
      // await this.animalModel.create(animal);
    });
    //inserción por lotes en la BD
    await this.animalModel.insertMany(animals);
    return 'Seed excecuted';
  }
}
