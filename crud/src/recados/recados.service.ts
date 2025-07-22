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

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateRecadoDto = {
      lido: updateRecadoDto?.lido,
      texto: updateRecadoDto?.texto,
    };
    const recado = await this.recadoRepository.preload({
      id,
      ...partialUpdateRecadoDto,
    });

    if (!recado) return this.throwNotFoundError();

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
