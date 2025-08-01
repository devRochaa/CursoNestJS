import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { RecadosModule } from 'src/recados/recados.module';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';
import { RoutePermissionsModule } from 'src/route-permissions/route-permissions.module';
import { RoutePermissions } from 'src/route-permissions/entities/route-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, RoutePermissions]),
    forwardRef(() => RecadosModule),
    MyDynamicModule.register({
      apiKey: 'aqui vem apikey',
      apiUrl: 'http://blabla.bla',
    }),
    forwardRef(() => RoutePermissionsModule),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
