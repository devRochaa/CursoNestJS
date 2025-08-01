import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';

//pega todos os erros
//BadRequestException para pegar erros especificos
// @Catch(Error)
// export class ErrorExceptionFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const res = ctx.getResponse();
//     const req = ctx.getRequest();

//     const statusCode = exception.getStatus ? exception.getStatus() : 400;
//     const exceptionResponse = exception.getResponse
//       ? exception.getResponse()
//       : { message: 'Error', statusCode };

//     res.status(statusCode).json({
//       ...exceptionResponse,
//       data: new Date().toISOString(),
//       path: req.url,
//     });
//   }
// }
