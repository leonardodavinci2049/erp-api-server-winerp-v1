import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppConfigService } from './app-config.service.js';
import { getLocalTimestamp } from '../core/utils/functions/get_local_timestamp.js';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  getHello() {
    return {
      name: 'Server WinERP API',
      status: 'online',
      version: '1.0.1',
      documentation: '/',
      timestamp: getLocalTimestamp('America/Fortaleza'),
      endpoints: {
        base: '/api',
        auth: '/api/app-config',
      },
    };
  }


  @Post()
  create() {
    return this.appConfigService.create();
  }


}
