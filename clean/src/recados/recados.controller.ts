import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { UsuarioService } from 'src/usuario/usuario.service';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import { ROUTE_POLICY_KEY } from 'src/auth/auth.constants';
import { RoutePolicies } from 'src/auth/constants/enum/route-policies.enum';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { AuthAndPolicyGuard } from 'src/auth/guards/auth-and-policy.guard';

@UsePipes(ParseIntIdPipe)
@Controller('recados')
export class RecadosController {
  constructor(
    private readonly recadosService: RecadosService,
    private readonly usuariosService: UsuarioService,
  ) {}

  @SetRoutePolicy(RoutePolicies.findAllRecados)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosService.findAll(paginationDto);
    return recados;
  }

  @SetRoutePolicy(RoutePolicies.findOneRecado)
  @UseGuards(AuthAndPolicyGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recadosService.findOne(id);
  }

  @SetRoutePolicy(RoutePolicies.createRecado)
  @UseGuards(AuthAndPolicyGuard)
  @Post()
  create(
    @Body() createRecadoDto: CreateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.create(createRecadoDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRecadoDto: UpdateRecadoDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  }
  // @UseGuards(AuthTokenGuard)
  // @Patch(':id')
  // update(
  //   @Param('id') id: number,
  //   @Body() updateRecadoDto: UpdateRecadoDto,
  //   @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  // ) {
  //   return this.recadosService.update(id, updateRecadoDto, tokenPayload);
  // }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.recadosService.remove(id);
  }
}
