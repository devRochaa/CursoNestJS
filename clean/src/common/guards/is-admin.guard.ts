import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('IsAdminGuard');
    const req = context.switchToHttp().getRequest();
    const role = req['user']?.role;

    if (role === 'admin') {
      return true;
    }
    return false;
  }
}
