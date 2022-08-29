import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  findAll() {
    return `This action returns all common`;
  }
}
