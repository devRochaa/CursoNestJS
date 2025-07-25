import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    // console.log('interceptor');
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    //checar token do usuario
    if (!token || token != '1234') {
      throw new UnauthorizedException('Usuário não logado');
    }
    log('seu token é: ', token);
    return next.handle();
  }
}
