import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrdersDto } from '../dto/create-orders.dto';
import { UpdateOrdersDto } from '../dto/update-orders.dto';
import { ValidationObjectId } from '../../../pipe/ValidationObjetId';
import { QueryRequestDto } from '../../../common/dto/QueryRequest.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createDto: CreateOrdersDto) {
    return this.ordersService.create(createDto);
  }

  @Get()
  findAll(@Query() queryParams: QueryRequestDto) {
    return this.ordersService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id', ValidationObjectId) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ValidationObjectId) id: string,
    @Body() updateDto: UpdateOrdersDto,
  ) {
    return this.ordersService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidationObjectId) id: string) {
    return this.ordersService.remove(id);
  }
}
