import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controller/application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApplicationSchema,
  ApplicationSchemaModel,
} from './entities/application.entity';
import Redis from 'ioredis';
import { RedisIndexService } from './services/redis-index.service';
import { OrdersModule } from '../ordenes/orders.module';
import { GenerateTokenController } from './controller/generate-token.controller';
import { Trace, TranceSchemaModel } from './entities/trace.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicationSchema.name, schema: ApplicationSchemaModel },
    ]),
    MongooseModule.forFeature([
      { name: Trace.name, schema: TranceSchemaModel },
    ]),
    OrdersModule,
  ],
  controllers: [ApplicationController, GenerateTokenController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.NEST_HOST_REDIS ?? 'localhost',
          port: 6379,
        });
      },
    },
    ApplicationService,
    RedisIndexService,
  ],
  exports: [MongooseModule],
})
export class ApplicationModule {}
