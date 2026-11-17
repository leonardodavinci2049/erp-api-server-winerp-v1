import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard.js';

import { FornecedorCreateDto } from './dto/fornecedor-create.dto.js';
import { FornecedorDeleteDto } from './dto/fornecedor-delete.dto.js';
import { FornecedorFindAllDto } from './dto/fornecedor-find-all.dto.js';
import { FornecedorProductFindIdDto } from './dto/fornecedor-product-find-id.dto.js';
import { FornecedorUpdateDto } from './dto/fornecedor-update.dto.js';

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
  @Post('v2/fornecedor-find-all')
  fornecedorFindAll(@Body() dataJsonDto: FornecedorFindAllDto) {
    return this.supplierService.taskFornecedorFindAll(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/fornecedor-product-find-id')
  fornecedorProductFindId(@Body() dataJsonDto: FornecedorProductFindIdDto) {
    return this.supplierService.taskFornecedorProductFindId(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/fornecedor-create')
  fornecedorCreate(@Body() dataJsonDto: FornecedorCreateDto) {
    return this.supplierService.taskFornecedorCreate(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/fornecedor-update')
  fornecedorUpdate(@Body() dataJsonDto: FornecedorUpdateDto) {
    return this.supplierService.taskFornecedorUpdate(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/fornecedor-delete')
  fornecedorDelete(@Body() dataJsonDto: FornecedorDeleteDto) {
    return this.supplierService.taskFornecedorDelete(dataJsonDto);
  }
}
