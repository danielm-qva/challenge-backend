import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controller/orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderEntitySchema, OrdersSchema } from './entities/orders.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderEntitySchema.name,
        schema: OrdersSchema,
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [MongooseModule],
})
export class OrdersModule {}
