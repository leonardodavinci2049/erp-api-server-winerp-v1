import { logServiceError } from '../core/utils/functions/log_service_error.js';
import { Injectable } from '@nestjs/common';
import { processProcedureResultMutation } from '../core/process-result/process-procedure-result.mutation.js';
import { processSqlResultQuery } from '../core/process-result/process-sql-result.query.js';
import { RESPONSE_CODES } from '../core/utils/constants/globalConstants.js';
import { ResultModel } from '../core/process-result/result.model.js';
import { DbOperationService } from '../db-operation/db-operation.service.js';

import { SupplierFindManagerIdV2Dto } from './dto/supplier-find-manager-id-v2.dto.js';
import { SupplierUpdGeneralFieldDto } from './dto/supplier-upd-general-field.dto.js';

import { SupplierFindManagerIdV2Query } from './query/supplier-find-manager-id-v2.query.js';
import { SupplierUpdGeneralFieldQuery } from './query/supplier-upd-general-field.query.js';

import {
  SpResultRecordUpdateType,
  TblSupplierFindManagerId,
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


}
