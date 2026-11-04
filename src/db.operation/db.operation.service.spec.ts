import { Test, TestingModule } from '@nestjs/testing';
import { DbOperationService } from './db.operation.service.js';

describe('DbOperationService', () => {
  let service: DbOperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbOperationService],
    }).compile();

    service = module.get<DbOperationService>(DbOperationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
