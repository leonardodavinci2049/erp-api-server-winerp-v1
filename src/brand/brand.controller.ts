import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard.js';
import { BrandService } from './brand.service.js';

import { BrandCreateV2Dto } from './dto/brand-create-v2.dto.js';
import { BrandDeleteV2Dto } from './dto/brand-delete-v2.dto.js';
import { BrandFindAllV2Dto } from './dto/brand-find-all-v2.dto.js';
import { BrandFindIdV2Dto } from './dto/brand-find-id-v2.dto.js';
import { BrandFindManagerAllV2Dto } from './dto/brand-find-manager-all-v2.dto.js';
import { BrandFindManagerIdV2Dto } from './dto/brand-find-manager-id_v2.dto.js';
import { BrandFindSearchV2Dto } from './dto/brand-find-search-v2.dto.js';
import { BrandUpdGeneralFieldDto } from './dto/brand-upd-general-field.dto.js';
import { BrandUpdInlFlagActiveV2Dto } from './dto/brand-upd-inl-flag-active-v2.dto.js';
import { BrandUpdInlNameV2Dto } from './dto/brand-upd-inl-name-v2.dto.js';
import { BrandUpdInlNotesV2Dto } from './dto/brand-upd-inl-notes-v2.dto.js';
import { BrandUpdInlSlugV2Dto } from './dto/brand-upd-inl-slug-v2.dto.js';
import { BrandUpdateV2Dto } from './dto/brand-update-v2.dto.js';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  getHello() {
    return {
      name: 'Wholesale API',
      status: 'online',
      version: '1.0.1',
      documentation: '/',
      timestamp: new Date().toISOString(),
      endpoints: {
        base: '/api',
        auth: '/api/brand',
      },
    };
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-create')
  brandCreateV2(@Body() dataJsonDto: BrandCreateV2Dto) {
    return this.brandService.taskBrandCreateV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-find-all')
  brandFindAllV2(@Body() dataJsonDto: BrandFindAllV2Dto) {
    return this.brandService.taskBrandFindAllV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-search-all')
  brandSearchAllV2(@Body() dataJsonDto: BrandFindSearchV2Dto) {
    return this.brandService.taskBrandSearchAllV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-find-manager-all')
  brandFindManagerAllV2(@Body() dataJsonDto: BrandFindManagerAllV2Dto) {
    return this.brandService.taskBrandFindManagerAllV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-find-id')
  brandFindIdV2(@Body() dataJsonDto: BrandFindIdV2Dto) {
    return this.brandService.taskBrandFindIdV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-find-manager-id')
  BrandFindManagerIdV2(@Body() dataJsonDto: BrandFindManagerIdV2Dto) {
    return this.brandService.taskBrandFindManagerIdV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-update')
  brandUpdateV2(@Body() dataJsonDto: BrandUpdateV2Dto) {
    return this.brandService.taskBrandUpdateV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-delete')
  brandDeleteV2(@Body() dataJsonDto: BrandDeleteV2Dto) {
    return this.brandService.taskBrandDeleteV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-upd-general-field')
  brandUpdGeneralFieldV2(@Body() dataJsonDto: BrandUpdGeneralFieldDto) {
    return this.brandService.taskBrandUpdGeneralFieldV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-upd-inl-flag-active')
  brandUpdInlFlagActiveV2(@Body() dataJsonDto: BrandUpdInlFlagActiveV2Dto) {
    return this.brandService.taskBrandUpdInlFlagActiveV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-upd-inl-name')
  brandUpdInlNameV2(@Body() dataJsonDto: BrandUpdInlNameV2Dto) {
    return this.brandService.taskBrandUpdInlNameV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-upd-inl-notes')
  brandUpdInlNotesV2(@Body() dataJsonDto: BrandUpdInlNotesV2Dto) {
    return this.brandService.taskBrandUpdInlNotesV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-upd-inl-slug')
  brandUpdInlSlugV2(@Body() dataJsonDto: BrandUpdInlSlugV2Dto) {
    return this.brandService.taskBrandUpdInlSlugV2(dataJsonDto);
  }
}
