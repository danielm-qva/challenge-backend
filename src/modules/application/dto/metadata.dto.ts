import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonDto } from '../../../common/dto/common.dto';
import { AccreditationPeriodDto } from './assistant.dto';

export class PassportDTO extends CommonDto {
  @IsNotEmpty()
  @IsString()
  countryOrigin: string;
}

export class DniDTO extends CommonDto {
  @IsNotEmpty()
  @IsString()
  took: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  folio: string;
}

export class AccreditationDTO extends CommonDto {
  @ValidateNested()
  @Type(() => AccreditationPeriodDto)
  creditingPeriod: AccreditationPeriodDto;

  @IsNotEmpty()
  @IsString()
  responsibility: string;
}
