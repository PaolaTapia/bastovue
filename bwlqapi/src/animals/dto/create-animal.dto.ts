import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  @MaxLength(16)
  @MinLength(16)
  @ApiProperty()
  idSenasa: string;
  @IsString()
  @ApiProperty()
  @ApiProperty()
  @IsOptional()
  typeAnimal: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty()
  @IsOptional()
  weight: number;
  @IsString()
  @ApiProperty()
  @IsOptional()
  paddock: string;
  @IsString()
  @ApiProperty()
  @IsOptional()
  typeDevice: string;
  @IsString()
  @Length(8, 8)
  @ApiProperty()
  numberDevice: string;
  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  is_active: boolean;
}
