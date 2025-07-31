import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import {
  MY_DYNAMIC_CONFIG,
  MyDinamicModuleConfigs,
} from 'src/my-dynamic/my-dynamic.module';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,

    @Inject(MY_DYNAMIC_CONFIG)
    private readonly myDynamicConfigs: MyDinamicModuleConfigs,
  ) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.usuarioService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.usuarioService.remove(id, tokenPayload);
  }
}
