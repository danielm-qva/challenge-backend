import { IsNotEmpty, IsString } from 'class-validator';

export class CommonDto {
  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  namePerson: string;

  @IsNotEmpty()
  @IsString()
  countryBirth: string;
}
