import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { fileURLToPath } from 'node:url';
import { DbOperationModule } from '../db-operation/db-operation.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: fileURLToPath(new URL('../../pageroot/', import.meta.url)),
      exclude: /^\/api(?:\/|$)/, // Exclui a API
    }),
    ThrottlerModule.forRoot([
      // Proteção contra excesso de requisições
      {
        ttl: 60000, // tempo 1 minuto
        limit: 50000, // 50000 requisições
        // ignoreUserAgents: [/googlebot/],
      },
    ]),
    DbOperationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
