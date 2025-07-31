import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateRoutePermissionDto } from './dto/create-route-permission.dto';
import { UpdateRoutePermissionDto } from './dto/update-route-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutePermissions } from './entities/route-permission.entity';
import { Repository } from 'typeorm';
import { RolePoliciesMap } from 'src/auth/constants/role-policies-map';

@Injectable()
export class RoutePermissionsService implements OnModuleInit {
  constructor(
    @InjectRepository(RoutePermissions)
    private readonly routePermissionsRepository: Repository<RoutePermissions>,
  ) {}

  async onModuleInit() {
    await this.seedPermissions();
  }

  private async seedPermissions() {
    const defaultPermissions = Object.keys(RolePoliciesMap);
    console.log(defaultPermissions);
    for (const name of defaultPermissions) {
      const exists = await this.routePermissionsRepository.findOne({
        where: { name },
      });
      if (!exists) {
        await this.routePermissionsRepository.save({ name });
        console.log(`✔️ Permissão criada: ${name}`);
      }
    }
  }

  create(createRoutePermissionDto: CreateRoutePermissionDto) {
    return 'This action adds a new routePermission';
  }

  findAll() {
    return `This action returns all routePermissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} routePermission`;
  }

  update(id: number, updateRoutePermissionDto: UpdateRoutePermissionDto) {
    return `This action updates a #${id} routePermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} routePermission`;
  }
}
