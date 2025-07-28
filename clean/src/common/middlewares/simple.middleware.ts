import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //console.log('middleware: A conexão Iniciou');
    //console.log('SimpleMiddleware: Olá');
    res.setHeader('CABECALHO', 'MIDDLEWARE');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        nome: 'daniel',
        sobrenome: 'rocha',
        role: 'admin',
      };
    }

    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });
    // res.on('finish', () => {
    //   console.log('A conexão terminou');
    // });
    return next(); //chama próximo middleware de return se nn quiser chamar mais nada
    //console.log('Depois de chamar o proximo middleware');
  }
}
