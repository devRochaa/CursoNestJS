import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const login = async (
  app: INestApplication,
  email: string,
  password: string,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth')
    .send({ email, password });

  return response.body.accessToken;
};

export const createUserAndLogin = async (app: INestApplication) => {
  const name = 'Any User';
  const email = 'anyuser@email.com';
  const password = '123456';

  await request(app.getHttpServer()).post('/usuario').send({
    name,
    email,
    password,
  });

  return login(app, email, password);
};
