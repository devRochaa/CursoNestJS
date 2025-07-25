import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class AnotherMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //console.log('AnotherMiddleware: Olá');
    const authorization = req.headers?.authorization;
    res.setHeader('CABECALHO', 'MIDDLEWARE');

    // return res.status(404).send({
    //   message: 'Não encontrado',
    // });
    next();
    //console.log('Tchau');
  }
}
