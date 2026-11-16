import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard.js';

import { SupplierFindManagerIdV2Dto } from './dto/supplier-find-manager-id-v2.dto.js';
import { SupplierUpdGeneralFieldDto } from './dto/supplier-upd-general-field.dto.js';

import { SupplierService } from './supplier.service.js';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

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
        auth: '/api/supplier',
      },
    };
  }


  @UseGuards(AuthGuard)
  @Post('v2/supplier-find-manager-id')
  supplierFindManagerIdV2(@Body() dataJsonDto: SupplierFindManagerIdV2Dto) {
    return this.supplierService.taskSupplierFindManagerIdV2(dataJsonDto);
  }


  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-general-field')
  supplierUpdGeneralFieldV2(@Body() dataJsonDto: SupplierUpdGeneralFieldDto) {
    return this.supplierService.taskSupplierUpdGeneralFieldV2(dataJsonDto);
  }

}
