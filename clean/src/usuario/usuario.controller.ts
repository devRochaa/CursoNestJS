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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipeBuilder,
  HttpStatus,
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
import { AuthAndPolicyGuard } from 'src/auth/guards/auth-and-policy.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/constants/enum/route-policies.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';

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

  @SetRoutePolicy(RoutePolicies.findAllUsuarios)
  @UseGuards(AuthAndPolicyGuard)
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

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  async uploadPicture(
    @UploadedFile(
      // new ParseFilePipe({
      //   validators: [
      //     new MaxFileSizeValidator({
      //       maxSize: 10 * (1024 * 1024),
      //     }),
      //     new FileTypeValidator({ fileType: /jpeg|jpg|png/g }),
      //   ],
      // }),
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
          maxSize: 5 * (1024 * 1024),
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.usuarioService.uploadPicture(file, tokenPayload);
  }
}
//   @UseGuards(AuthTokenGuard)
//   @UseInterceptors(FilesInterceptor('file'))
//   @Post('upload-picture')
//   async uploadPicture(
//     @UploadedFiles() files: Express.Multer.File[],
//     @TokenPayloadParam() tokenPayload: TokenPayloadDto,
//   ) {
//     const result: string[] = [];
//     for (const file of files) {
//       const fileExtension = path
//         .extname(file.originalname)
//         .toLowerCase()
//         .substring(1);
//       const fileName = `${randomUUID()}.${fileExtension}`;
//       const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);
//       result.push(fileFullPath);
//       //console.log(fileFullPath);

//       await fs.writeFile(fileFullPath, file.buffer);
//     }
//     return result;

// }
