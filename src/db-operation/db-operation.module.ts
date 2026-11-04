import { Module } from '@nestjs/common';
import { DbConnectionModule } from '../db-connection/db-connection.module.js';
import { DbOperationService } from './db-operation.service.js';

@Module({
  imports: [DbConnectionModule],
  providers: [DbOperationService],
  exports: [DbOperationService],
})
export class DbOperationModule {}
