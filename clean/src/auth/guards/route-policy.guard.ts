import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolicies } from '../constants/enum/route-policies.enum';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { RolePoliciesMap } from '../constants/role-policies-map';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );

    // não precisamos de permissões para essa rota
    // visto que nenhuma foi configurada
    if (!routePolicyRequired) {
      return true;
    }

    // Precisamos do tokenPayload vindo de AuthTokenGuard para continuar
    const request = context.switchToHttp().getRequest();
    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY];

    if (!tokenPayload) {
      throw new UnauthorizedException(
        `Rota requer permissão ${routePolicyRequired}. Usuário não logado.`,
      );
    }

    const { usuario }: { usuario: Usuario } = tokenPayload;
    const rolePermissions = RolePoliciesMap[usuario.role.name];
    console.log(rolePermissions);

    if (!rolePermissions.includes(routePolicyRequired)) {
      throw new UnauthorizedException(
        `Usuário não tem a permissão ${routePolicyRequired}.`,
      );
    }

    console.log(routePolicyRequired);
    return true;
  }
}
