import { IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AccreditationDTO, DniDTO, PassportDTO } from './metadata.dto';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['Passport', 'DNI', 'Accreditation'])
  type: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['snapshot', 'batch'])
  typeNotification: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type((opt) => {
    switch (opt?.object.type) {
      case 'Passport':
        return PassportDTO;
      case 'DNI':
        return DniDTO;
      case 'Accreditation':
        return AccreditationDTO;
      default:
        return PassportDTO;
    }
  })
  metadata: PassportDTO | DniDTO | AccreditationDTO;
}
