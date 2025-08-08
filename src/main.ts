import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Servicio de Recepción de Órdenes')
    .setDescription(
      'Se requiere la implementación de un servicio que, a través de peticiones REST sobre HTTP, recepcione y procese solicitudes de impresión de documentos digitales.',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new TraceInterceptor());
  await app.listen(process.env.NEST_PORT_APP ?? 3000);
}

bootstrap().then(() => {
  console.log('Server is running');
});
