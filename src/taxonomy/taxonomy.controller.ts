import { Controller, Post } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service.js';

@Controller('taxonomy')
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Post()
  create() {
    return this.taxonomyService.create();
  }

}
