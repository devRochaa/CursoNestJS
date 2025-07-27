import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  //HttpCode,
  //HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import { Request } from 'express';
import { UrlParam } from 'src/common/params/url-param.decorator';
import { ReqDataParam } from 'src/common/params/req-data-param.decorator';
import { UsuarioService } from 'src/usuario/usuario.service';
import { RegexProtocol } from 'src/common/regex/regex.protocol';
import {
  ONLY_LOWERCASE_LETTER_REGEX,
  ONLY_LOWERCASE_LETTER_REGEX_FACTORY,
  REMOVE_SPACES_REGEX,
  REMOVE_SPACES_REGEX_FACTORY,
  SERVER_NAME,
} from './recados.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowerCaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';
//import { Recado } from './entities/recado.entity';

//Update -> PATCH / PUT
//PATCH é utilizado para atualizar dados de um recurso
//PUT é utilizado para atualizar um recurso inteiro

// DTO - Data Transfer Object
// DTO - Objeto simples -> Nest (Valida dados / transformar dados)
//@UseInterceptors(AuthTokenInterceptor)
//@UseInterceptors(SimpleCacheInterceptor)
@UsePipes(ParseIntIdPipe) // repetido em main ts repetição em usuarios
@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    private readonly usuariosService: UsuarioService,
    @Inject(SERVER_NAME)
    private readonly serverName: string,

    //varias formas de chamar essas funções

    private readonly regexProtocol: RegexProtocol, //modo 1

    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RegexProtocol, // modo 2

    @Inject(ONLY_LOWERCASE_LETTER_REGEX)
    private readonly OnlyLowerCaseLetters: RegexProtocol, //modo 2

    //por factory provider:

    @Inject(REMOVE_SPACES_REGEX_FACTORY)
    private readonly removeSpacesRegexFactory: RemoveSpacesRegex, //modo 3

    @Inject(ONLY_LOWERCASE_LETTER_REGEX_FACTORY)
    private readonly OnlyLowerCaseLettersFactory: OnlyLowerCaseLettersRegex, //modo 3
  ) {}
  //encontrar todos os recados
  //@HttpCode(HttpStatus.NOT_FOUND)
  //@UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor) // cabeçalho personalizado em common
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
    @UrlParam() url: string, //parametro personalizado
    @ReqDataParam('method') method,
  ) {
    console.log('Controller executado, USER: ', req['user']?.nome);
    console.log('baseUrl: ', method);
    console.log(
      'Injetando valores com inject no controller: ',
      this.serverName,
    );

    //chamando as funções
    console.log(this.regexProtocol.execute(this.serverName)); //modo 1
    console.log(this.removeSpacesRegex.execute(this.serverName)); //modo 2
    console.log(this.OnlyLowerCaseLetters.execute('SÓ minusculas')); //modo 2
    console.log(
      this.removeSpacesRegexFactory.execute('factory: REMOVE OS ESPACOS '),
    ); //modo 3
    console.log(
      this.OnlyLowerCaseLettersFactory.execute('factory: Tira as Maiusculas '), //modo 3
    );

    const recados = await this.recadosService.findAll(paginationDto);
    //throw new Error('teste para filter');
    return recados;
    // return `Essa rota retorna todos os recados limit= ${limit} offset= ${offset}`;
  }

  // @Get(':dinamica/fixa/:id') //{dinamico: VALOR, fixa: fixa, id: VALOR}
  //@UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  @Get(':id')
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
