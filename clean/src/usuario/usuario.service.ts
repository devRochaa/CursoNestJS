import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Req,
  Scope,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { RolePoliciesMap } from 'src/auth/constants/role-policies-map';
import { RoutePermissions } from 'src/route-permissions/entities/route-permission.entity';
import { RolesEnum } from 'src/auth/constants/enum/roles-enum';

@Injectable({ scope: Scope.DEFAULT })
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly hashingService: HashingService,
    private readonly rolePermissionsRepository: Repository<RoutePermissions>,
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
      const passwordHash = await this.hashingService.hash(
        createUsuarioDto.password,
      );

      const defaultRole = await this.rolePermissionsRepository.findOne({
        where: { name: RolesEnum.USER },
      });

      const dadosUsuario = {
        name: createUsuarioDto.name,
        passwordHash: passwordHash,
        email: createUsuarioDto.email,
        roleId: defaultRole,
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
        id: 'asc',
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

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
    tokenPayload: TokenPayloadDto,
  ) {
    try {
      if (tokenPayload.sub !== id) {
        throw new ForbiddenException('Você não é essa pessoa.');
      }

      const partialUpdUsuarioDto = {
        name: updateUsuarioDto?.name,
        email: updateUsuarioDto?.email,
      };

      if (updateUsuarioDto?.password) {
        const passwordHash = await this.hashingService.hash(
          updateUsuarioDto.password,
        );

        partialUpdUsuarioDto['passwordHash'] = passwordHash;
      }

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

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const usuario = await this.usuarioRepository.findOneBy({
      id,
    });
    if (tokenPayload.sub !== id) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }
    if (!usuario) return this.throwNotFound(id);

    return await this.usuarioRepository.remove(usuario);
  }
}
