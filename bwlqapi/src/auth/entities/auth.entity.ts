import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

//export type UserDocument = Animal & Document;

@Schema()
export class Auth extends Document {
  //id: string; //id que genera Mongo

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
