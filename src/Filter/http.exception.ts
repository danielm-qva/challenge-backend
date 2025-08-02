import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus() || HttpStatus.BAD_REQUEST;

    const errorResponse = exception.getResponse();

    const errors = Array.isArray(errorResponse)
      ? errorResponse
      : [exception.message];

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      errors: errors.map((error: string) => ({
        message: error,
      })),
    });
  }
}
