import { MarcaFindAllDto } from './dto/marca-find-all.dto.js';
import { MarcaAddComboBoxDto } from './dto/marca-add-combo-box.dto.js';
import { MarcaCreateDto } from './dto/marca-create.dto.js';
import { MarcaUpdateDto } from './dto/marca-update.dto.js';
import { MarcaDeleteDto } from './dto/marca-delete.dto.js';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard.js';
import { BrandFindManagerIdV2Dto } from './dto/brand-find-manager-id_v2.dto.js';
import { BrandFindSearchV2Dto } from './dto/brand-find-search-v2.dto.js';
import { BrandUpdGeneralFieldDto } from './dto/brand-upd-general-field.dto.js';
import { BrandService } from './brand.service.js';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(AuthGuard)
  @Post('v2/marca-find-all')
  brandMarcaFindAllV2(@Body() dto: MarcaFindAllDto) {
    return this.brandService.taskBrandMarcaFindAllV2(dto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/marca-AddComboBox')
  brandMarcaAddComboBoxV2(@Body() dto: MarcaAddComboBoxDto) {
    return this.brandService.taskBrandMarcaAddComboBoxV2(dto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/marca-create')
  brandMarcaCreateV2(@Body() dto: MarcaCreateDto) {
    return this.brandService.taskBrandMarcaCreateV2(dto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/marca-update')
  brandMarcaUpdateV2(@Body() dto: MarcaUpdateDto) {
    return this.brandService.taskBrandMarcaUpdateV2(dto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/marca-delete')
  brandMarcaDeleteV2(@Body() dto: MarcaDeleteDto) {
    return this.brandService.taskBrandMarcaDeleteV2(dto);
  }

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
  @Post('v2/brand-search-all')
  brandSearchAllV2(@Body() dataJsonDto: BrandFindSearchV2Dto) {
    return this.brandService.taskBrandSearchAllV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-find-manager-id')
  brandFindManagerIdV2(@Body() dataJsonDto: BrandFindManagerIdV2Dto) {
    return this.brandService.taskBrandFindManagerIdV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/brand-upd-general-field')
  brandUpdGeneralFieldV2(@Body() dataJsonDto: BrandUpdGeneralFieldDto) {
    return this.brandService.taskBrandUpdGeneralFieldV2(dataJsonDto);
  }
}
