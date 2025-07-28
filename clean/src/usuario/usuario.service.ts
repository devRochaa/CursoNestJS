import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';

@Injectable({ scope: Scope.DEFAULT })
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  private throwNotFound(id: number): never {
    throw new NotFoundException(`Usuario with ID ${id} not found`);
  }

  private throwConflict(error) {
    if (error.code === '23505') {
      throw new ConflictException('E-mail já está cadastrado.');
    }
    throw error;
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const dadosUsuario = {
        name: createUsuarioDto.name,
        passwordHash: createUsuarioDto.password,
        email: createUsuarioDto.email,
      };

      const novoUsuario = this.usuarioRepository.create(dadosUsuario);
      await this.usuarioRepository.save(novoUsuario);
      return novoUsuario;
    } catch (error) {
      this.throwConflict(error);
    }
  }
  //d
  async findAll() {
    const usuarios = await this.usuarioRepository.find({
      order: {
        id: 'desc',
      },
    });
    return usuarios;
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({
      id,
    });

    if (!usuario) this.throwNotFound(id);

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const partialUpdUsuarioDto = {
        name: updateUsuarioDto?.name,
        passwordHash: updateUsuarioDto?.password,
        email: updateUsuarioDto?.email,
      };

      const novoUsuario = await this.usuarioRepository.preload({
        id,
        ...partialUpdUsuarioDto,
      });

      if (!novoUsuario) return this.throwNotFound(id);

      await this.usuarioRepository.save(novoUsuario);
      return novoUsuario;
    } catch (error) {
      this.throwConflict(error);
    }
  }

  async remove(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({
      id,
    });

    if (!usuario) return this.throwNotFound(id);

    return await this.usuarioRepository.remove(usuario);
  }
}
