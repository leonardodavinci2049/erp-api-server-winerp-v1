import { Module } from '@nestjs/common';

import { DatabaseService } from './database.service.js';

@Module({
  imports: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
