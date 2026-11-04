import { Module } from '@nestjs/common';
import { DbOperationService } from './db.operation.service.js';

@Module({
  providers: [DbOperationService],
})
export class DbOperationModule {}
