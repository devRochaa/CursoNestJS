import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello') //método da solicitação
  getHello(): string {
    return 'qualquer coisa';
    // return this.appService.getHello();
  }

  @Get('exemplo')
  exemplo() {
    return this.appService.solucionaExemplo();
  }
}
// @Controller('')
// export class AppTest {
//   //constructor(private readonly appService: AppService) {}

//   @Get('') //método da solicitação
//   getHello(): string {
//     return 'qadsa';
//     // return this.appService.getHello();
//   }
// }
