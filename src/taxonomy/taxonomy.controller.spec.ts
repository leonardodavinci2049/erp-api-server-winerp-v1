import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomyController } from './taxonomy.controller.js';
import { TaxonomyService } from './taxonomy.service.js';

describe('TaxonomyController', () => {
  let controller: TaxonomyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxonomyController],
      providers: [TaxonomyService],
    }).compile();

    controller = module.get<TaxonomyController>(TaxonomyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
