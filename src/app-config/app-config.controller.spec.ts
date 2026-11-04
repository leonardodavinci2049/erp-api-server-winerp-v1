import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
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

  it('should return API information with the current timestamp in Fortaleza', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-04T12:00:00.000Z'));

    try {
      const result = controller.getHello();

      expect(result).toEqual({
        name: 'Server WinERP API',
        status: 'online',
        version: '1.0.1',
        documentation: '/',
        timestamp: '2026-11-04T09:00:00.000-03:00',
        endpoints: {
          base: '/api',
          auth: '/api/app-config',
        },
      });
    } finally {
      vi.useRealTimers();
    }
  });
});
