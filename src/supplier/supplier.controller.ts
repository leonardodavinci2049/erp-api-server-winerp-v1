import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { SupplierCreateV2Dto } from './dto/supplier-create-v2.dto';
import { SupplierDeleteV2Dto } from './dto/supplier-delete-v2.dto';
import { SupplierFindAllV2Dto } from './dto/supplier-find-all-v2.dto';
import { SupplierFindIdV2Dto } from './dto/supplier-find-id-v2.dto';
import { SupplierFindManagerAllV2Dto } from './dto/supplier-find-manager-all-v2.dto';
import { SupplierFindManagerIdV2Dto } from './dto/supplier-find-manager-id-v2.dto';
import { SupplierFindSearchV2Dto } from './dto/supplier-find-search-v2.dto';
import { SupplierRelCreateV2Dto } from './dto/supplier-rel-create-v2.dto';
import { SupplierRelDeleteV2Dto } from './dto/supplier-rel-delete-v2.dto';
import { SupplierRelFindProdAllV2Dto } from './dto/supplier-rel-find-prod-all-v2.dto';
import { SupplierUpdGeneralFieldDto } from './dto/supplier-upd-general-field.dto';
import { SupplierUpdAddressV2Dto } from './dto/supplier-upd-address-v2.dto';
import { SupplierUpdBusinessV2Dto } from './dto/supplier-upd-business-v2.dto';
import { SupplierUpdDeliveryV2Dto } from './dto/supplier-upd-delivery-v2.dto';
import { SupplierUpdGeneralV2Dto } from './dto/supplier-upd-general-v2.dto';
import { SupplierUpdInlTypePersonV2Dto } from './dto/supplier-upd-inl-type-person-v2.dto';
import { SupplierUpdInternetV2Dto } from './dto/supplier-upd-internet-v2.dto';
import { SupplierUpdPersonalV2Dto } from './dto/supplier-upd-personal-v2.dto';
import { SupplierUpdateV2Dto } from './dto/supplier-update-v2.dto';
import { SupplierService } from './supplier.service';

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
  @Post('v2/supplier-create')
  supplierCreateV2(@Body() dataJsonDto: SupplierCreateV2Dto) {
    return this.supplierService.taskSupplierCreateV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-rel-create')
  taskSupplierRelCreateV2(@Body() dataJsonDto: SupplierRelCreateV2Dto) {
    return this.supplierService.taskSupplierRelCreateV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-find-all')
  supplierFindAllV2(@Body() dataJsonDto: SupplierFindAllV2Dto) {
    return this.supplierService.taskSupplierFindAllV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-search-all')
  supplierSearchAllV2(@Body() dataJsonDto: SupplierFindSearchV2Dto) {
    return this.supplierService.taskSupplierSearchAllV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-find-manager-all')
  supplierFindManagerAllV2(@Body() dataJsonDto: SupplierFindManagerAllV2Dto) {
    return this.supplierService.taskSupplierFindManagerAllV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-find-manager-id')
  supplierFindManagerIdV2(@Body() dataJsonDto: SupplierFindManagerIdV2Dto) {
    return this.supplierService.taskSupplierFindManagerIdV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-rel-find-prod-all')
  taskSupplierRelFindProdAllV2(
    @Body() dataJsonDto: SupplierRelFindProdAllV2Dto,
  ) {
    return this.supplierService.taskSupplierRelFindProdAllV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-find-id')
  supplierFindIdV2(@Body() dataJsonDto: SupplierFindIdV2Dto) {
    return this.supplierService.taskSupplierFindIdV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-update')
  supplierUpdateV2(@Body() dataJsonDto: SupplierUpdateV2Dto) {
    return this.supplierService.taskSupplierUpdateV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-rel-delete')
  taskSupplierRelDeleteV2(@Body() dataJsonDto: SupplierRelDeleteV2Dto) {
    return this.supplierService.taskSupplierRelDeleteV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-delete')
  taskSupplierDeleteV2(@Body() dataJsonDto: SupplierDeleteV2Dto) {
    return this.supplierService.taskSupplierDeleteV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-general-field')
  supplierUpdGeneralFieldV2(@Body() dataJsonDto: SupplierUpdGeneralFieldDto) {
    return this.supplierService.taskSupplierUpdGeneralFieldV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-address')
  supplierUpdAddressV2(@Body() dataJsonDto: SupplierUpdAddressV2Dto) {
    return this.supplierService.taskSupplierUpdAddressV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-business')
  supplierUpdBusinessV2(@Body() dataJsonDto: SupplierUpdBusinessV2Dto) {
    return this.supplierService.taskSupplierUpdBusinessV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-delivery')
  supplierUpdDeliveryV2(@Body() dataJsonDto: SupplierUpdDeliveryV2Dto) {
    return this.supplierService.taskSupplierUpdDeliveryV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-general')
  supplierUpdGeneralV2(@Body() dataJsonDto: SupplierUpdGeneralV2Dto) {
    return this.supplierService.taskSupplierUpdGeneralV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-inl-type-person')
  supplierUpdInlTypePersonV2(
    @Body() dataJsonDto: SupplierUpdInlTypePersonV2Dto,
  ) {
    return this.supplierService.taskSupplierUpdInlTypePersonV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-internet')
  supplierUpdInternetV2(@Body() dataJsonDto: SupplierUpdInternetV2Dto) {
    return this.supplierService.taskSupplierUpdInternetV2(dataJsonDto);
  }

  @UseGuards(AuthGuard)
  @Post('v2/supplier-upd-personal')
  supplierUpdPersonalV2(@Body() dataJsonDto: SupplierUpdPersonalV2Dto) {
    return this.supplierService.taskSupplierUpdPersonalV2(dataJsonDto);
  }
}
