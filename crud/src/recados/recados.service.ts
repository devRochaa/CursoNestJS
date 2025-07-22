import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
  ) {}
  private lastId = 1;
  private recados: Recado[] = [
    {
      id: 1,
      texto: 'mensagemm',
      de: 'Joana',
      para: 'joao',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFoundError() {
    //throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Recado não encontrado');
  }

  async findOne(id: number) {
    //const recado = this.recados.find(item => +id === item.id);
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
    });
    if (recado) return recado;
    this.throwNotFoundError();
  }

  async findAll(): Promise<Recado[]> {
    const recados = await this.recadoRepository.find();
    return recados;
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const newRecado = {
      ...createRecadoDto,
      lido: false,
      data: new Date(),
    };
    const recado = this.recadoRepository.create(newRecado);
    return await this.recadoRepository.save(recado);
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

  update(id: number, updateRecadoDto: UpdateRecadoDto): Recado {
    const recadosExistenteIndex = this.recados.findIndex(
      item => item.id === id,
    );

    if (recadosExistenteIndex < 0) this.throwNotFoundError();

    const recadoExistente = this.recados[recadosExistenteIndex];

    this.recados[recadosExistenteIndex] = {
      ...recadoExistente,
      ...updateRecadoDto,
    };
    return this.recados[recadosExistenteIndex];
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({
      id,
    });
    if (!recado) {
      throw new NotFoundException(`Recado with ID ${id} not found`);
    }
    return await this.recadoRepository.remove(recado);
  }
}
