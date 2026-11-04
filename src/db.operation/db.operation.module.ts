import { Module } from '@nestjs/common';
import { DbOperationService } from './db.operation.service.js';
import { DbOperationController } from './db.operation.controller.js';

@Module({
  controllers: [DbOperationController],
  providers: [DbOperationService],
})
export class DbOperationModule {}
