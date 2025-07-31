import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import recadosConfig from './recados.config';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { forbidden } from '@hapi/joi';

// Scope.DEFAULT -> O provider em questão é um singletown
// Scope.REQUEST -> O provider em questão é instanciado a cada requisição
// Scope.TRANSIENT -> é criada uma instancia do provider para cada classe que injetar este provider
@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly usuarioService: UsuarioService,
    // private readonly configService: ConfigService<{
    //   //dois tipos de tipagem opcionais
    //   DATABASE_USERNAME: string;
    // }>,
    @Inject(recadosConfig.KEY)
    private readonly recadosConfiguration: ConfigType<typeof recadosConfig>,
  ) {
    // const dbName = this.configService.get<string>('DATABASE_USERNAME');
    // console.log(dbName);
    console.log(this.recadosConfiguration);
  }

  throwNotFoundError(): never {
    throw new NotFoundException('Recado não encontrado');
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
      relations: ['de', 'para'],
      select: {
        de: {
          id: true,
          name: true,
        },
        para: {
          id: true,
          name: true,
        },
      },
    });

    if (recado) return recado;
    this.throwNotFoundError();
  }

  async findAll(paginationDto: PaginationDto): Promise<Recado[]> {
    //console.log('Service executado', this.recadosUtils.inverteString('daniel'));
    const { limit = 10, offset = 0 } = paginationDto;

    const recados = await this.recadoRepository.find({
      take: limit, //quantos registros serão exibidos
      skip: offset, //quantos registros devem pulados //paginação é a combinação de quantidade limit e de offset
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          name: true,
        },
        para: {
          id: true,
          name: true,
        },
      },
    });

    return recados;
  }

  async create(
    createRecadoDto: CreateRecadoDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const deId = tokenPayload.sub;
    const { paraId } = createRecadoDto;

    //encontrar pessoa que esta enviando
    const de = await this.usuarioService.findOne(deId);
    //encontrar pessoa que esta sendo enviado
    const para = await this.usuarioService.findOne(paraId);

    const newRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };
    const recado = this.recadoRepository.create(newRecado);
    await this.recadoRepository.save(recado);
    return {
      ...recado,
      de: {
        id: recado.de.id,
        nome: recado.de.name,
      },
      para: {
        id: recado.para.id,
        nome: recado.para.name,
      },
    };
  }
  // create(createRecadoDto: CreateRecadoDto): Recado {
  //   this.lastId++;

  //   const id = this.lastId;
  //   const newRecado: Recado = {
  //     id,
  //     ...createRecadoDto,
  //     lido: false,
  //     data: new Date(),
  //   };
  //   this.recados.push(newRecado);
  //   return newRecado;
  // }

  async update(
    id: number,
    updateRecadoDto: UpdateRecadoDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const recado = await this.findOne(id);

    const deId = tokenPayload.sub;
    if (recado.de.id !== deId) {
      throw new ForbiddenException(
        'Você só pode alterar recados de sua autoria.',
      );
    }

    if (recado.lido === true) {
      throw new ConflictException(
        'Esse recado não pode ser atualizado, pois ja foi visto',
      );
    }
    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido ?? recado.lido;

    await this.recadoRepository.save(recado);
    return recado;
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({
      id,
    });

    if (!recado) return this.throwNotFoundError();

    return await this.recadoRepository.remove(recado);
  }
}
