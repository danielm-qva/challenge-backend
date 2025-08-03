import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controller/application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApplicationSchema,
  ApplicationSchemaModel,
} from './entities/application.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicationSchema.name, schema: ApplicationSchemaModel },
    ]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
