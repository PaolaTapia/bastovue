import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimalsDocument = Animals & Document;

@Schema()
export class Animals {
  @Prop({ required: true, unique: true })
  idSenasa: string;
  @Prop({ required: true })
  typeAnimal: string;
  @Prop({ default: 250 })
  weight: number;
  @Prop({ default: 'Paddock1' })
  paddock: string;
  @Prop({ default: 'COLLAR' })
  typeDevice: string;
  @Prop({ default: '123456abc' })
  numberDevice: string;
  @Prop({ default: true })
  is_active: boolean;
}

export const AnimalsSchema = SchemaFactory.createForClass(Animals);
