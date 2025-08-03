import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrdersDto } from '../dto/create-orders.dto';
import { UpdateOrdersDto } from '../dto/update-orders.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  OrderEntitySchema,
  OrderSchemaDocument,
} from '../entities/orders.entity';
import { Model } from 'mongoose';
import { QueryRequestDto } from '../../../common/dto/QueryRequest.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrderEntitySchema.name)
    private readonly orderSchema: Model<OrderSchemaDocument>,
  ) {}

  async create(createDto: CreateOrdersDto) {
    try {
      return await this.orderSchema.create(createDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll({ page, size }: QueryRequestDto) {
    return await this.orderSchema
      .find()
      .setOptions({ sanitizeFilter: true })
      .skip((page - 1) * size)
      .limit(size)
      .exec();
  }

  async findOne(id: string) {
    const orden = await this.orderSchema.findById(id).exec();
    if (!orden) {
      throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
    }
    return orden;
  }

  async update(_id: string, updateDto: UpdateOrdersDto) {
    const updateOrders = await this.orderSchema
      .findByIdAndUpdate(_id, updateDto, { new: true })
      .exec();
    if (!updateOrders) {
      throw new HttpException(
        'The orders could not be updated',
        HttpStatus.NOT_FOUND,
      );
    }
    return updateOrders;
  }

  async remove(id: string) {
    const removeOrders = await this.orderSchema.findByIdAndDelete(id).exec();
    if (!removeOrders) {
      throw new HttpException('The orders not remove', HttpStatus.NOT_FOUND);
    }
    return removeOrders;
  }
}
