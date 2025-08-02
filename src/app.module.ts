import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationModule } from './modules/application/application.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.NEST_MONGO_URL ?? 'mongodb://mongo:27017/challenge-backend',
    ),
    ScheduleModule.forRoot(),
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
