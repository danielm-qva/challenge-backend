import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateOrdersDto {
  @IsNotEmpty()
  @IsString()
  codeOrders: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  requestAssociated: string[];
}
