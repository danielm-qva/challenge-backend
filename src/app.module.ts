import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './modules/application/application.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.NEXT_APP_JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRoot(
      process.env.NEST_MONGO_URL ??
        'mongodb://localhost:27017/challenge-backend',
    ),
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
