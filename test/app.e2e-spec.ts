import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.main/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await NestFactory.create<INestApplication<App>>(AppModule, { logger: false });
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  it('serve a página inicial na raiz', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Content-Type', /html/);
  });

  it('não retorna a página inicial para rotas inexistentes da API', () => {
    return request(app.getHttpServer()).get('/api/inexistente').expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
