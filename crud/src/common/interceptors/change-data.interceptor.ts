import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { log } from 'console';
import { map } from 'rxjs';

@Injectable()
export class ChangeDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    //log('ChangeDataInterceptor executado antes');

    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return {
            count: data.length,
            data,
          };
        }
      }),
    );
  }
}
