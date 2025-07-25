import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { AnotherMiddleware } from 'src/common/middlewares/another.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MyExceptionFilter } from 'src/common/fliters/my-exception.filter';
import { ErrorExceptionFilter } from 'src/common/fliters/error-exception.filter';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: '1234',
      autoLoadEntities: true, // carrega entidades sem precisar especificalas
      synchronize: true, // sincroniza com o BD. Não deve ser usado em produção
    }),
    RecadosModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: IsAdminGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware, AnotherMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
