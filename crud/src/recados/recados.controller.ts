import {
  Body,
  Controller,
  Delete,
  Get,
  //HttpCode,
  //HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
//import { Recado } from './entities/recado.entity';

//Update -> PATCH / PUT
//PATCH é utilizado para atualizar dados de um recurso
//PUT é utilizado para atualizar um recurso inteiro

// DTO - Data Transfer Object
// DTO - Objeto simples -> Nest (Valida dados / transformar dados)

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}
  //encontrar todos os recados
  //@HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  async findAll(@Query() pagination: any) {
    //const { limit = 100, offset = 0 } = pagination;
    console.log(pagination);
    const recados = await this.recadosService.findAll();
    return recados;
    // return `Essa rota retorna todos os recados limit= ${limit} offset= ${offset}`;
  }

  // @Get(':dinamica/fixa/:id') //{dinamico: VALOR, fixa: fixa, id: VALOR}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recadosService.findOne(id);
    //return 'Essa rota retorna UM recado';
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    //console.log(body);
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
  ) {
    return this.recadosService.update(id, updateRecadoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recadosService.remove(id);
  }
}
