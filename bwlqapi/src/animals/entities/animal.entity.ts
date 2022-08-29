import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//export type AnimalsDocument = Animal & Document;

@Schema()
export class Animal extends Document {
  //id: string; //id que genera Mongo
  @Prop({
    required: true,
    unique: true,
  })
  idSenasa: string;

  @Prop({
    default: 'TORO',
    enum: ['VACA', 'TORO', 'NOVILLO'],
  })
  typeAnimal: string;

  @Prop({ default: 250 })
  weight: number;

  @Prop({ default: 'Paddock1' })
  paddock: string;

  @Prop({ enum: ['CARAVANA', 'COLLAR'], default: 'COLLAR' })
  typeDevice: string;

  @Prop({ default: '123456abc' })
  numberDevice: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
