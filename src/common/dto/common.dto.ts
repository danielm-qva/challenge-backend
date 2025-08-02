import { IsNotEmpty, IsString } from 'class-validator';

export class CommonDto {
  @IsNotEmpty()
  @IsString()
  number: string;
  // common
  @IsNotEmpty()
  @IsString()
  namePerson: string;

  @IsNotEmpty()
  @IsString()
  countryBirth: string;
}
