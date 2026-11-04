import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigController } from './app-config.controller.js';
import { AppConfigService } from './app-config.service.js';

describe('AppConfigController', () => {
  let controller: AppConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppConfigController],
      providers: [AppConfigService],
    }).compile();

    controller = module.get<AppConfigController>(AppConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
