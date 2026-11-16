import { Injectable } from '@nestjs/common';
import { processProcedureResultMutation } from '../core/process-result/process-procedure-result.mutation.js';
import { processSqlResultQuery } from '../core/process-result/process-sql-result.query.js';
import { ResultModel } from '../core/process-result/result.model.js';
import { RESPONSE_CODES } from '../core/utils/constants/globalConstants.js';
import { logServiceError } from '../core/utils/functions/log_service_error.js';
import { DbOperationService } from '../db-operation/db-operation.service.js';
import { BrandFindManagerIdV2Dto } from './dto/brand-find-manager-id_v2.dto.js';
import { BrandFindSearchV2Dto } from './dto/brand-find-search-v2.dto.js';
import { BrandUpdGeneralFieldDto } from './dto/brand-upd-general-field.dto.js';
import { BrandFindManagerIdV2Query } from './query/brand-find-manager-id-v2.query.js';
import { BrandFindSearchV2Query } from './query/brand-find-search-v2.query.js';
import { BrandUpdGeneralFieldQuery } from './query/brand-upd-general-field.query.js';
import type {
  SpResultRecordUpdateType,
  TblBrandFindManagerId,
  TblBrandFindSearch,
} from './types/brand.type.js';

@Injectable()
export class BrandService {
  constructor(private readonly dbService: DbOperationService) {}

  async taskBrandSearchAllV2(dataJsonDto: BrandFindSearchV2Dto) {
    try {
      const { queryString, queryParams } = BrandFindSearchV2Query(dataJsonDto);
      const resultData = await this.dbService.selectQuery<TblBrandFindSearch>(
        queryString,
        queryParams,
      );

      return processSqlResultQuery(
        resultData,
        'Brand find All',
        'Brand find All not found',
        'Dados carregados com sucesso.',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandSearchAllV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível pesquisar as marcas.',
        '',
        [],
      );
    }
  }

  async taskBrandFindManagerIdV2(dataJsonDto: BrandFindManagerIdV2Dto) {
    try {
      const { queryString, queryParams } =
        BrandFindManagerIdV2Query(dataJsonDto);
      const resultData =
        await this.dbService.selectQuery<TblBrandFindManagerId>(
          queryString,
          queryParams,
        );

      return processSqlResultQuery(
        resultData,
        'Brand find manager Id',
        'Brand find manager Id not found',
        'Dados carregados com sucesso.',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandFindManagerIdV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível consultar a marca.',
        '',
        [],
      );
    }
  }

  async taskBrandUpdGeneralFieldV2(dataJsonDto: BrandUpdGeneralFieldDto) {
    try {
      const { procedureName, queryParams } =
        BrandUpdGeneralFieldQuery(dataJsonDto);
      const resultData = (await this.dbService.callProcedure(
        procedureName,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Brand field update failed',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandUpdGeneralFieldV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível atualizar o campo da marca.',
        '',
        [],
      );
    }
  }
}
