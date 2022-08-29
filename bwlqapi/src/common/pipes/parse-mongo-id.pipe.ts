import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    //console.log(value, metadata);
    //62fcf05fd1550d48624b5163 { metatype: [Function: Object], type: 'param', data: 'id' }
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is Invalid ObjectId`);
    }
    return value;
  }
}
