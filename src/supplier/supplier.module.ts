import { Module } from '@nestjs/common';
import { DbOperationModule } from 'src/db-operation/db-operation.module';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  imports: [DbOperationModule],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
