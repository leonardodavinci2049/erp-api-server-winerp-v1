import { logServiceError } from '../core/utils/functions/log_service_error.js';
import { Injectable } from '@nestjs/common';
import { processProcedureResultMutation } from '../core/process-result/process-procedure-result.mutation.js';
import { processSqlResultMutation } from '../core/process-result/process-sql-result.mutation.js';
import { processSqlResultQuery } from '../core/process-result/process-sql-result.query.js';
import { RESPONSE_CODES } from '../core/utils/constants/globalConstants.js';
import { ResultModel } from '../core/process-result/result.model.js';
import { DbOperationService } from '../db-operation/db-operation.service.js';

import { FornecedorCreateDto } from './dto/fornecedor-create.dto.js';
import { FornecedorDeleteDto } from './dto/fornecedor-delete.dto.js';
import { FornecedorFindAllDto } from './dto/fornecedor-find-all.dto.js';
import { FornecedorProductFindIdDto } from './dto/fornecedor-product-find-id.dto.js';
import { FornecedorUpdateDto } from './dto/fornecedor-update.dto.js';
import { SupplierFindManagerIdV2Dto } from './dto/supplier-find-manager-id-v2.dto.js';
import { SupplierUpdGeneralFieldDto } from './dto/supplier-upd-general-field.dto.js';

import { FornecedorCreateQuery } from './query/fornecedor-create.query.js';
import { FornecedorDeleteQuery } from './query/fornecedor-delete.query.js';
import { FornecedorFindAllQuery } from './query/fornecedor-find-all.query.js';
import { FornecedorProductFindIdQuery } from './query/fornecedor-product-find-id.query.js';
import { FornecedorUpdateQuery } from './query/fornecedor-update.query.js';
import { SupplierFindManagerIdV2Query } from './query/supplier-find-manager-id-v2.query.js';
import { SupplierUpdGeneralFieldQuery } from './query/supplier-upd-general-field.query.js';

import {
  SpResultRecordUpdateType,
  TblSupplierFindManagerId,
  TblSupplierFornecedorFindAll,
  TblSupplierFornecedorProduct,
} from './types/supplier.type.js';

@Injectable()
export class SupplierService {
  constructor(private readonly dbOperationService: DbOperationService) {}

  async taskSupplierFindManagerIdV2(dataJsonDto: SupplierFindManagerIdV2Dto) {
    try {
      const { queryString, queryParams } =
        SupplierFindManagerIdV2Query(dataJsonDto);

      const resultData =
        await this.dbOperationService.selectQuery<TblSupplierFindManagerId>(
          queryString,
          queryParams,
        );

      return processSqlResultQuery(
        resultData,
        'Supplier find manager Id',
        'Supplier find manager Id not found',
        'Dados carregados com sucesso.',
      );
    } catch (err) {
      await logServiceError('supplier', 'taskSupplierFindManagerIdV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível concluir a operação de fornecedor.',
        '',
        [],
      );
    }
  }

  async taskSupplierUpdGeneralFieldV2(dataJsonDto: SupplierUpdGeneralFieldDto) {
    try {
      const { procedureName, queryParams } =
        SupplierUpdGeneralFieldQuery(dataJsonDto);

      const resultData = (await this.dbOperationService.callProcedure(
        procedureName,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier field update failed',
      );
    } catch (err) {
      await logServiceError('supplier', 'taskSupplierUpdGeneralFieldV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível concluir a operação de fornecedor.',
        '',
        [],
      );
    }
  }

  async taskFornecedorFindAll(dataJsonDto: FornecedorFindAllDto) {
    try {
      const { queryString, queryParams } = FornecedorFindAllQuery(dataJsonDto);

      const resultData =
        await this.dbOperationService.selectQuery<TblSupplierFornecedorFindAll>(
          queryString,
          queryParams,
        );

      return processSqlResultQuery(
        resultData,
        'Supplier find all',
        'Nenhum fornecedor encontrado.',
        'Dados carregados com sucesso.',
      );
    } catch (err) {
      await logServiceError('supplier', 'taskFornecedorFindAll', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível consultar os fornecedores.',
        '',
        [],
      );
    }
  }

  async taskFornecedorProductFindId(dataJsonDto: FornecedorProductFindIdDto) {
    try {
      const { queryString, queryParams } =
        FornecedorProductFindIdQuery(dataJsonDto);

      const resultData =
        await this.dbOperationService.selectQuery<TblSupplierFornecedorProduct>(
          queryString,
          queryParams,
        );

      return processSqlResultQuery(
        resultData,
        'Supplier product find id',
        'Nenhum produto de fornecedor encontrado.',
        'Dados carregados com sucesso.',
      );
    } catch (err) {
      await logServiceError('supplier', 'taskFornecedorProductFindId', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível consultar os produtos do fornecedor.',
        '',
        [],
      );
    }
  }

  async taskFornecedorCreate(dataJsonDto: FornecedorCreateDto) {
    try {
      const { queryString, queryParams } = FornecedorCreateQuery(dataJsonDto);

      const resultData = await this.dbOperationService.mutationQuery(
        queryString,
        queryParams,
      );

      return processSqlResultMutation(
        resultData,
        'Fornecedor criado com sucesso.',
        'Não foi possível criar o fornecedor.',
      );
    } catch (err) {
      await logServiceError('supplier', 'taskFornecedorCreate', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível criar o fornecedor.',
        '',
        [],
      );
    }
  }

  async taskFornecedorUpdate(dataJsonDto: FornecedorUpdateDto) {
    try {
      const { queryString, queryParams } = FornecedorUpdateQuery(dataJsonDto);

      const resultData = await this.dbOperationService.mutationQuery(
        queryString,
        queryParams,
      );

      return processSqlResultMutation(
        resultData,
        'Fornecedor atualizado com sucesso.',
        'Nenhum fornecedor foi atualizado.',
        dataJsonDto.PE_ID_FORNECEDOR,
      );
    } catch (err) {
      await logServiceError('supplier', 'taskFornecedorUpdate', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível atualizar o fornecedor.',
        '',
        [],
      );
    }
  }

  async taskFornecedorDelete(dataJsonDto: FornecedorDeleteDto) {
    try {
      const { queryString, queryParams } = FornecedorDeleteQuery(dataJsonDto);

      const resultData = await this.dbOperationService.mutationQuery(
        queryString,
        queryParams,
      );

      return processSqlResultMutation(
        resultData,
        'Fornecedor excluído com sucesso.',
        'Nenhum fornecedor foi excluído.',
      );
    } catch (err) {
      await logServiceError('supplier', 'taskFornecedorDelete', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível excluir o fornecedor.',
        '',
        [],
      );
    }
  }
}
