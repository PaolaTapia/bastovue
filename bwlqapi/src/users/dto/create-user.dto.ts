import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(8)
  password: string;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  is_active: boolean;
}
