import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import recadosConfig from './recados.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado]),
    UsuarioModule,
    ConfigModule.forFeature(recadosConfig),
  ],

  controllers: [RecadosController],
  providers: [RecadosService],
  exports: [],
})
export class RecadosModule {}
