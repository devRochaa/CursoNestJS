import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { log } from 'console';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    log('ErrorHandlingInterceptor executado antes');

    //await new Promise(resolve => setTimeout(resolve, 5000));

    return next.handle().pipe(
      catchError((error: any) => {
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            return new BadRequestException(error.message);
          }
          return error;
        });
      }),
    );
  }
}
