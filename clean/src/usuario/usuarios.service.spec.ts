import { Repository } from 'typeorm';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoutePermissions } from 'src/route-permissions/entities/route-permission.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ConflictException } from '@nestjs/common';

describe('UsuariosService', () => {
  let usuarioService: UsuarioService;
  let usuarioRepository: Repository<Usuario>;
  let hashingService: HashingService;
  let routePermissionsRepository: Repository<RoutePermissions>;

  const defaultRole = {
    id: 1,
    name: 'USER',
  };

  beforeAll(async () => {
    console.time('Setup Test Module');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RoutePermissions),
          useValue: {
            findOne: jest.fn().mockResolvedValue(defaultRole),
          },
        },
      ],
    }).compile();
    console.timeEnd('Setup Test Module');

    usuarioService = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<Usuario>>(
      getRepositoryToken(Usuario),
    );
    hashingService = module.get<HashingService>(HashingService);
    routePermissionsRepository = module.get(
      getRepositoryToken(RoutePermissions),
    );

    // (routePermissionsRepository.findOne as jest.Mock).mockResolvedValue({
    //   id: 1,
    //   name: 'USER',
    // });
  });

  it('usuarioService should be defined', () => {
    expect(usuarioService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new person', async () => {
      //arrange

      const createUsuarioDto: CreateUsuarioDto = {
        email: 'luiz@email.com',
        name: 'luiz',
        password: '123456',
      };
      const passwordHash = 'hashdesenha';
      const novoUsuario = {
        id: 1,
        name: createUsuarioDto.name,
        passwordHash,
        email: createUsuarioDto.email,
        role: defaultRole,
      };

      //como o valor retornado pelas funções abaixo são necessários
      //vamos simular este valor
      const hashSpy = jest
        .spyOn(hashingService, 'hash')
        .mockResolvedValue(passwordHash);
      const routeFindOne = jest
        .spyOn(routePermissionsRepository, 'findOne')
        .mockResolvedValue(defaultRole as any);
      const usuarioCreate = jest
        .spyOn(usuarioRepository, 'create')
        .mockReturnValue(novoUsuario as any);

      //act
      const result = await usuarioService.create(createUsuarioDto);

      // Assert
      // o método hashingService.hash foi chamado com o createUsuarioDto.password
      expect(hashSpy).toHaveBeenCalledWith(createUsuarioDto.password);
      expect(routeFindOne).toHaveBeenCalled();
      // o método usuarioRepository.create foi chamado com o dados da nova pessoa com a hash e a role
      expect(usuarioCreate).toHaveBeenCalledWith({
        name: createUsuarioDto.name,
        passwordHash: passwordHash,
        email: createUsuarioDto.email,
        role: defaultRole,
      });
      // o método usuarioRepository.save foi chamado com o dados da nova pessoa gerada por usuarioRepository.create
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usuarioRepository.save).toHaveBeenCalledWith(novoUsuario);

      // O resultado do usuarioService.create retoruno a nova pessoa criada?
      expect(result).toEqual(novoUsuario);
    });

    it('deve lançar conflictexception quando e-mail já existe', async () => {
      jest
        .spyOn(usuarioRepository, 'save')
        .mockRejectedValue({ code: '23505' });

      await expect(usuarioService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });
    it('deve lançar erro genérico', async () => {
      jest
        .spyOn(usuarioRepository, 'save')
        .mockRejectedValue(new Error('Erro Genérico'));

      await expect(usuarioService.create({} as any)).rejects.toThrow(
        new Error('Erro Genérico'),
      );
    });

    it('caso default role nao exista', async () => {
      jest.spyOn(routePermissionsRepository, 'findOne').mockResolvedValue(null);

      await expect(usuarioService.create({} as any)).rejects.toThrow(
        new ConflictException('Role padrão USER não encontrada.'),
      );
    });
  });
});
//configurar - Arrange
// fazer alguma ação - Act
//conferir se essa ação foi a esperada -  assert
