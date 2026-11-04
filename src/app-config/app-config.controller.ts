import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppConfigService } from './app-config.service.js';

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
      timestamp: new Date().toISOString(),
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
