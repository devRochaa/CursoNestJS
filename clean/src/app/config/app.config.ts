import { INestApplication, ValidationPipe } from '@nestjs/common';

export default (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //remove chaves que nao estao no DTO
      forbidNonWhitelisted: true, //levantar erro quando a chave não existir
      transform: false, // tenta transformar os tipos de dados de param e dtos
    }),
    //new ParseIntIdPipe(),
  );
  return app;
};
