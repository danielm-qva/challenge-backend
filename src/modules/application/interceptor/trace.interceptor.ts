import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trace, TraceDocument } from '../entities/trace.entity';
import { tap } from 'rxjs';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @InjectModel(Trace.name) private readonly traceModel: Model<TraceDocument>,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url, headers } = request;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const authHeader = headers?.authorization ?? '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const isValid = await this.jwtService.verify(token, {
      secret: process.env.APP_JWT_SECRET,
    });

    return next.handle().pipe(
      tap(
        async () =>
          await this.traceModel.create({
            domine: isValid?.base_url,
            name: isValid?.name,
            method,
            path: url,
          }),
      ),
    );
  }
}
