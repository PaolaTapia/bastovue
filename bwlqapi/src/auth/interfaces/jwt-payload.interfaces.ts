import { ObjectId } from 'mongoose';
export interface IJwtPayload {
  sub: ObjectId;
  email: string;
}
