import { PartialType } from '@nestjs/mapped-types';
import { CreateRoutePermissionDto } from './create-route-permission.dto';

export class UpdateRoutePermissionDto extends PartialType(
  CreateRoutePermissionDto,
) {}
