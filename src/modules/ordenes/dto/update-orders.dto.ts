import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdersDto } from './create-orders.dto';

export class UpdateOrdersDto extends PartialType(CreateOrdersDto) {}
