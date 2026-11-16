import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { DbOperationService } from '../db-operation/db-operation.service.js';
import { SupplierService } from './supplier.service.js';

describe('SupplierService', () => {
  let service: SupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: DbOperationService,
          useValue: {
            selectQuery: vi.fn(),
            mutationQuery: vi.fn(),
            callProcedure: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
