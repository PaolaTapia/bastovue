import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @ApiProperty()
  limit?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  offset?: number;
}
