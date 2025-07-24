import {
  Body,
  Controller,
  Delete,
  Get,
  //HttpCode,
  //HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';
import { SimpleCacheInterceptor } from 'src/common/interceptors/simple-cache.interceptor';
import { ChangeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';
//import { Recado } from './entities/recado.entity';

//Update -> PATCH / PUT
//PATCH é utilizado para atualizar dados de um recurso
//PUT é utilizado para atualizar um recurso inteiro

// DTO - Data Transfer Object
// DTO - Objeto simples -> Nest (Valida dados / transformar dados)
@UsePipes(ParseIntIdPipe) // repetido em main ts repetição em usuarios
@Controller('recados')
@UseInterceptors(ChangeDataInterceptor)
//@UseInterceptors(SimpleCacheInterceptor)
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}
  //encontrar todos os recados
  //@HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  //@UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor) // cabeçalho personalizado em common
  async findAll(@Query() paginationDto: PaginationDto) {
    console.log('Controller executado');
    const recados = await this.recadosService.findAll(paginationDto);
    return recados;
    // return `Essa rota retorna todos os recados limit= ${limit} offset= ${offset}`;
  }

  // @Get(':dinamica/fixa/:id') //{dinamico: VALOR, fixa: fixa, id: VALOR}
  @Get(':id')
  //@UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
    //return 'Essa rota retorna UM recado';
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    //console.log(body);
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRecadoDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recadosService.remove(id);
  }
}
