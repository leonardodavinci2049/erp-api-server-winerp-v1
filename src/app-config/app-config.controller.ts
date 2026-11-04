import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppConfigService } from './app-config.service.js';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Post()
  create() {
    return this.appConfigService.create();
  }


}
