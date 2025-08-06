import { Repository } from 'typeorm';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoutePermissions } from 'src/route-permissions/entities/route-permission.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
jest.mock('fs/promises');
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
    // console.time('Setup Test Module');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
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
    // console.timeEnd('Setup Test Module');

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

    it('should throw a ConflictException when the e-mail already exists', async () => {
      jest
        .spyOn(usuarioRepository, 'save')
        .mockRejectedValue({ code: '23505' });

      await expect(usuarioService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });
    it('should throw generic error', async () => {
      jest
        .spyOn(usuarioRepository, 'save')
        .mockRejectedValue(new Error('Erro Genérico'));

      await expect(usuarioService.create({} as any)).rejects.toThrow(
        new Error('Erro Genérico'),
      );
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(routePermissionsRepository, 'findOne').mockResolvedValue(null);

      await expect(usuarioService.create({} as any)).rejects.toThrow(
        new NotFoundException('Role padrão USER não encontrada.'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a usuario if the usuario is found', async () => {
      const userId = 1;
      const userFound = {
        id: userId,
        nome: 'luiz',
        email: 'luiz@email.com',
        passwordHash: '123456',
      };

      jest
        .spyOn(usuarioRepository, 'findOneBy')
        .mockResolvedValue(userFound as any);

      const result = await usuarioService.findOne(userId);

      expect(result).toEqual(userFound);
    });

    it('should return a NotFoundException, Usuario not found', async () => {
      jest.spyOn(usuarioRepository, 'findOneBy').mockResolvedValue(null);

      await expect(usuarioService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a usuario ALL usuarios is found', async () => {
      const usuarioMock: Usuario[] = [];

      jest
        .spyOn(usuarioRepository, 'find')
        .mockResolvedValue(usuarioMock as any);

      const result = await usuarioService.findAll();

      expect(result).toEqual(usuarioMock);
    });
  });

  describe('update', () => {
    it('should update a usuario if he has been authorized', async () => {
      // arrange
      const usuarioId = 1;
      const updateUsuarioDto = {
        name: 'daniel',
        email: 'd@.com',
        password: '123456',
      };
      const tokenPayload = { sub: usuarioId };
      const passwordHash = 'HASHDESENHA';
      const updatedUsuario = {
        id: usuarioId,
        name: updateUsuarioDto.name,
        email: updateUsuarioDto.email,
        passwordHash,
      };

      const hashSpy = jest
        .spyOn(hashingService, 'hash')
        .mockResolvedValue(passwordHash);
      const usuarioPreload = jest
        .spyOn(usuarioRepository, 'preload')
        .mockResolvedValue(updatedUsuario as any);
      const usuarioSave = jest
        .spyOn(usuarioRepository, 'save')
        .mockResolvedValue(updatedUsuario as any);
      // act

      const result = await usuarioService.update(
        usuarioId,
        updateUsuarioDto,
        tokenPayload as any,
      );
      // assert

      expect(hashSpy).toHaveBeenCalledWith(updateUsuarioDto.password);
      expect(usuarioPreload).toHaveBeenCalledWith({
        id: usuarioId,
        name: updateUsuarioDto.name,
        email: updateUsuarioDto.email,
        passwordHash,
      });
      expect(usuarioSave).toHaveBeenCalledWith(updatedUsuario);
      expect(result).toEqual(updatedUsuario);
    });

    it('should throw ForbiddenException, you are not the user', () => {
      const usuarioId = 1;
      const updateUsuarioDto = {};
      const tokenPayload = { sub: 2 };

      expect(
        usuarioService.update(
          usuarioId,
          updateUsuarioDto as any,
          tokenPayload as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException, usuario not found', () => {
      const usuarioId = 1;
      const updateUsuarioDto = { name: 'john doe' };
      const tokenPayload = { sub: usuarioId };

      jest.spyOn(usuarioRepository, 'preload').mockResolvedValue(undefined);

      expect(
        usuarioService.update(
          usuarioId,
          updateUsuarioDto as any,
          tokenPayload as any,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove usuario. if it found and authorized', async () => {
      const usuarioId = 1;
      const tokenPayload = { sub: usuarioId };
      const loadedUsuario = { name: 'daniel' };

      const usuarioFindOneBy = jest
        .spyOn(usuarioRepository, 'findOneBy')
        .mockResolvedValue(loadedUsuario as any);

      const usuarioRemove = jest
        .spyOn(usuarioRepository, 'remove')
        .mockResolvedValue(loadedUsuario as any);

      const result = await usuarioService.remove(
        usuarioId,
        tokenPayload as any,
      );
      expect(usuarioFindOneBy).toHaveBeenCalledWith({ id: usuarioId });
      expect(usuarioRemove).toHaveBeenCalledWith(loadedUsuario);
      expect(result).toEqual(loadedUsuario);
    });

    it('should throw ForbiddenException, you are not the user', () => {
      const usuarioId = 1;
      const tokenPayload = { sub: 2 };

      expect(
        usuarioService.remove(usuarioId, tokenPayload as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException, user not found', async () => {
      const usuarioId = 1;
      const tokenPayload = { sub: usuarioId };

      const usuarioFindOneBy = jest
        .spyOn(usuarioRepository, 'findOneBy')
        .mockResolvedValue(null);

      await expect(
        usuarioService.remove(usuarioId, tokenPayload as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadPicture', () => {
    it('should save the image and update the user', async () => {
      //arrange
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const mockUsuario = {
        id: 1,
        name: 'daniel',
        email: 'd.com',
      } as Usuario;

      const updatedUsuario = { ...mockUsuario, picture: '1.png' };
      const tokenPayload = { sub: 1 } as any;

      const userServiceFindOne = jest
        .spyOn(usuarioService, 'findOne')
        .mockResolvedValue(mockUsuario);
      const useReporSave = jest
        .spyOn(usuarioRepository, 'save')
        .mockResolvedValue(updatedUsuario);

      const filePath = path.resolve(process.cwd(), 'pictures', '1.png');

      //act
      const result = await usuarioService.uploadPicture(
        mockFile as any,
        tokenPayload,
      );

      //assert
      expect(fs.writeFile).toHaveBeenCalledWith(filePath, mockFile.buffer);
      expect(userServiceFindOne).toHaveBeenCalledWith(tokenPayload.sub);
      expect(useReporSave).toHaveBeenCalledWith(mockUsuario);
      expect(result).toEqual(updatedUsuario);
    });

    it('should throw BadRequestException, file size is too small', async () => {
      const mockFile = {
        originalname: 'test.png',
        size: 500,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      await expect(
        usuarioService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException, file size is too small', async () => {
      const mockFile = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;

      jest
        .spyOn(usuarioService, 'findOne')
        .mockRejectedValue(new NotFoundException(`Usuario not found`));

      await expect(
        usuarioService.uploadPicture(mockFile, tokenPayload),
      ).rejects.toThrow(new NotFoundException(`Usuario not found`));
    });
  });
});
//configurar - Arrange
// fazer alguma ação - Act
//conferir se essa ação foi a esperada -  assert
