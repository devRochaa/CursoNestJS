import { RolesEnum } from './enum/roles-enum';
import { RoutePolicies } from './enum/route-policies.enum';

export const RolePoliciesMap: Record<string, RoutePolicies[]> = {
  [RolesEnum.ADMIN]: [
    RoutePolicies.createRecado,
    RoutePolicies.findAllRecados,
    RoutePolicies.findOneRecado,
    RoutePolicies.updateRecado,
    RoutePolicies.deleteRecado,

    RoutePolicies.createUsuario,
    RoutePolicies.findAllUsuarios,
    RoutePolicies.findOneUsuario,
    RoutePolicies.deleteUsuario,
    RoutePolicies.updateUsuario,
  ],
  [RolesEnum.USER]: [
    RoutePolicies.findAllRecados,
    RoutePolicies.createRecado,
    RoutePolicies.updateRecado,
    RoutePolicies.deleteUsuario,
    RoutePolicies.findOneUsuario,
  ],
};
