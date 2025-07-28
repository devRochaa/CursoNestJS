import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { RecadosModule } from 'src/recados/recados.module';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    forwardRef(() => RecadosModule),
    MyDynamicModule.register({
      apiKey: 'aqui vem apikey',
      apiUrl: 'http://blabla.bla',
    }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
