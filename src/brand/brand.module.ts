import { Module } from '@nestjs/common';
import { DbOperationModule } from '../db.operation/db.operation.module.js';
import { BrandController } from './brand.controller.js';
import { BrandService } from './brand.service.js';

@Module({
  imports: [DbOperationModule],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
