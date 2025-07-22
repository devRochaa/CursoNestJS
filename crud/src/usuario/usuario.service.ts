import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  private throwNotFound(id: number) {
    throw new NotFoundException(`Usuario with ID ${id} not found`);
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  async findAll() {
    const usuarios = await this.usuarioRepository.find();
    return usuarios;
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({
      id,
    });

    if (!usuario) return this.throwNotFound(id);

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const partialUpdUsuarioDto = {
      name: updateUsuarioDto?.name,
      passwordHash: updateUsuarioDto?.password,
    };

    const usuario = await this.usuarioRepository.preload({
      id,
      ...partialUpdUsuarioDto,
    });

    if (!usuario) return this.throwNotFound(id);

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({
      id,
    });

    if (!usuario) return this.throwNotFound(id);

    return await this.usuarioRepository.remove(usuario);
  }
}
