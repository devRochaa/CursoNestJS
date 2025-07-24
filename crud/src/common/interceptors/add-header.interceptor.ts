import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { log } from 'console';
import { Observable } from 'rxjs';

export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //log('AddHeaderInterceptor executado');
    //throw new Error('Method not implemented.');

    const response = context.switchToHttp().getResponse();

    response.setHeader('X-Custom-Header', 'O Valor do cabeçalho');

    return next.handle();
  }
}
