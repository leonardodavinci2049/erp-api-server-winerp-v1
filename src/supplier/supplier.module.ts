import { Module } from '@nestjs/common';
import { DbOperationModule } from '../db-operation/db-operation.module.js';
import { SupplierController } from './supplier.controller.js';
import { SupplierService } from './supplier.service.js';

@Module({
  imports: [DbOperationModule],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
