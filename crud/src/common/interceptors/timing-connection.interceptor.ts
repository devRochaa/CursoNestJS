import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { log } from 'console';
import { tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const startTime = Date.now();
    //log('TimingConnectionInterceptor executado antes');

    //await new Promise(resolve => setTimeout(resolve, 5000));

    return next.handle().pipe(
      tap(() => {
        const finalTime = Date.now();
        const elapsed = finalTime - startTime;
        log(
          'TimingConnectionInterceptor executado depois, execução durou: ',
          elapsed / 1000 + ' segundos',
        );
      }),
    );
  }
}
