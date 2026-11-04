import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { DbOperationService } from './db-operation.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [DbOperationService],
  exports: [DbOperationService],
})
export class DbOperationModule {}
