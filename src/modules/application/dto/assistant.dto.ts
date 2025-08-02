import { IsDate, IsNotEmpty, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class AccreditationPeriodDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((opt: any) => opt.endDate > opt.startDate)
  endDate: Date;
}
