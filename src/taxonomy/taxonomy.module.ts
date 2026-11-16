import { Module } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service.js';
import { TaxonomyController } from './taxonomy.controller.js';

@Module({
  controllers: [TaxonomyController],
  providers: [TaxonomyService],
})
export class TaxonomyModule {}
