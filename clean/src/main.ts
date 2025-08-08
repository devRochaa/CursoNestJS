import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MyExceptionFilter } from './common/fliters/my-exception.filter';
import appConfig from './app/config/app.config';
//import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app);

  if (process.env.NODE_ENV === 'production') {
    //cors
    // meuapp.com.br -> front
    // backend-do-meu-app.com.br -> backend

    // helmet -> cabeçalho de segurança no protocolo HTTP
    // cors -> permitir que outro domínio faça request na sua aplicação
    app.use(helmet());
    app.enableCors({
      origin: 'https://meuapp.com.br',
    });
  }

  app.useGlobalFilters(new MyExceptionFilter());
  await app.listen(process.env.APP_PORT ?? 3000);
}
void bootstrap();
