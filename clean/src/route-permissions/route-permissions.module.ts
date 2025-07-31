import { forwardRef, Module } from '@nestjs/common';
import { RoutePermissionsService } from './route-permissions.service';
import { RoutePermissionsController } from './route-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutePermissions } from './entities/route-permission.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoutePermissions]),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [RoutePermissionsController],
  providers: [RoutePermissionsService],
  exports: [RoutePermissionsService],
})
export class RoutePermissionsModule {}
