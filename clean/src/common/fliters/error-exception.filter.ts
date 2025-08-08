import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';

// pega todos os erros
// BadRequestException para pegar erros especificos
@Catch() // <- captura todas as exceções
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const statusCode = exception.getStatus ? exception.getStatus() : 500;

    const exceptionResponse = exception.getResponse
      ? exception.getResponse()
      : { message: 'Internal server error', statusCode };

    const message =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : exceptionResponse;

    res.status(statusCode).json({
      ...message,
      data: new Date().toISOString(),
      path: req.url,
    });
  }
}
