import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import globalConfig from 'src/global-config/global.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import { RecadosModule } from 'src/recados/recados.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoutePermissionsModule } from 'src/route-permissions/route-permissions.module';
import * as path from 'path';
import appConfig from 'src/app/config/app.config';
import { createUserAndLogin } from './utils/testAuth';
import { createUsuarioDtoFactory } from './utils/factoryCreateUsuarioDto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          database: 'testing',
          password: '1234',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
          serveRoot: '/pictures',
        }),
        GlobalConfigModule,
        RecadosModule,
        UsuarioModule,
        AuthModule,
        RoutePermissionsModule,
      ],
    }).compile();

    app = module.createNestApplication();

    appConfig(app); //pasou config para outro arquivo

    await app.init();

    authToken = await createUserAndLogin(app);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/usuario (POST)', () => {
    it('deve criar uma usuario com sucesso', async () => {
      const createUsuarioDto = {
        email: 'teste@gmail.com',
        password: '123456',
        name: 'teste',
      };
      const response = await request(app.getHttpServer())
        .post('/usuario')
        .send(createUsuarioDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        id: expect.any(Number),
        email: 'teste@gmail.com',
        passwordHash: expect.any(String),
        name: 'teste',
        active: true,
        picture: '',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        role: expect.any(Object),
      });
      // console.log(response.status);
      // console.log(response.body);
    });

    it('deve gerar um erro email ja existe', async () => {
      const createUsuarioDto = {
        email: 'teste@gmail.com',
        password: '123456',
        name: 'teste',
      };
      await request(app.getHttpServer())
        .post('/usuario')
        .send(createUsuarioDto)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/usuario')
        .send(createUsuarioDto)
        .expect(HttpStatus.CONFLICT);

      //console.log(response.body.message);
      expect(response.body.message).toBe('E-mail já está cadastrado.');
    });

    it('deve gerar um erro senha curta', async () => {
      const createUsuarioDto = {
        email: 'teste@gmail.com',
        password: '123', //campo invalido
        name: 'teste',
      };

      const response = await request(app.getHttpServer())
        .post('/usuario')
        .send(createUsuarioDto)
        .expect(HttpStatus.BAD_REQUEST);

      //console.log(response.body.message);
      expect(response.body.message).toContain(
        'password must be longer than or equal to 4 characters',
      );
      expect(response.body.message).toEqual([
        'password must be longer than or equal to 4 characters',
      ]);
    });
  });

  describe('/usuario/:id (GET)', () => {
    it('deve retornar Usuario pelo id', async () => {
      const createUsuarioDto = {
        email: 'teste@gmail.com',
        password: '123456',
        name: 'teste',
      };

      const usuarioResponse = await request(app.getHttpServer())
        .post('/usuario')
        .send({
          ...createUsuarioDto,
        })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get('/usuario/' + usuarioResponse.body.id)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        id: expect.any(Number),
        email: 'teste@gmail.com',
        passwordHash: expect.any(String),
        name: 'teste',
        active: true,
        picture: '',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('deve retornar UNAUTHORIZED quando usuario não está logado', async () => {
      const usuarioResponse = await request(app.getHttpServer())
        .post('/usuario')
        .send({
          email: 'teste@gmail.com',
          password: '123456',
          name: 'teste',
        })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get('/usuario/' + usuarioResponse.body.id)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        message: 'Não logado!',
        error: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return error when user not found', async () => {
      await request(app.getHttpServer())
        .get('/usuario/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/usuario/ (GET)', () => {
    it('should', async () => {
      const createUsuarioDto = createUsuarioDtoFactory();

      await request(app.getHttpServer())
        .post('/usuario')
        .send({ ...createUsuarioDto })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get('/usuario')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            email: 'teste@gmail.com',
            name: 'teste',
          }),
        ]),
      );
    });
  });
});
