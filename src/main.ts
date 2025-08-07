import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http.exception';
import { TraceInterceptor } from './modules/application/interceptor/trace.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new TraceInterceptor());
  await app.listen(process.env.NEST_PORT_APP ?? 3000);
}

bootstrap().then(() => {
  console.log('Server is running');
});
