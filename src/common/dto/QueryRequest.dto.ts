import { IsNumber, IsOptional } from 'class-validator';

export class QueryRequestDto {
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  size: number = 10;
}
