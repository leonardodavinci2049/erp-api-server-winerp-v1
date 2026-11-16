import { MarcaFindAllDto } from './dto/marca-find-all.dto.js';
import { MarcaFindAllQuery } from './query/marca-find-all.query.js';
import { MarcaAddComboBoxDto } from './dto/marca-add-combo-box.dto.js';
import { MarcaAddComboBoxQuery } from './query/marca-add-combo-box.query.js';
import { MarcaCreateDto } from './dto/marca-create.dto.js';
import { MarcaCreateQuery } from './query/marca-create.query.js';
import { MarcaUpdateDto } from './dto/marca-update.dto.js';
import { MarcaUpdateQuery } from './query/marca-update.query.js';
import { MarcaDeleteDto } from './dto/marca-delete.dto.js';
import { MarcaDeleteQuery } from './query/marca-delete.query.js';
import { processSqlResultMutation } from '../core/process-result/process-sql-result.mutation.js';
import type {
  TblMarcaFindAll,
  TblMarcaAddComboBox,
  MarcaCreateResult,
  MarcaUpdateResult,
  MarcaDeleteResult,
} from './types/brand.type.js';
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

  async taskBrandMarcaFindAllV2(dto: MarcaFindAllDto) {
    try {
      const { queryString, queryParams } = MarcaFindAllQuery(dto);
      const resultData = await this.dbService.selectQuery<TblMarcaFindAll>(
        queryString,
        queryParams,
      );
      return processSqlResultQuery(
        resultData,
        'Marca FindAll',
        'Nenhuma marca encontrada.',
        'Dados carregados com sucesso.',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandMarcaFindAllV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível consultar a marca.',
        '',
        [],
      );
    }
  }

  async taskBrandMarcaAddComboBoxV2(dto: MarcaAddComboBoxDto) {
    try {
      const { queryString, queryParams } = MarcaAddComboBoxQuery(dto);
      const resultData = await this.dbService.selectQuery<TblMarcaAddComboBox>(
        queryString,
        queryParams,
      );
      return processSqlResultQuery(
        resultData,
        'Marca AddComboBox',
        'Nenhuma marca encontrada.',
        'Dados carregados com sucesso.',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandMarcaAddComboBoxV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível consultar a marca.',
        '',
        [],
      );
    }
  }

  async taskBrandMarcaCreateV2(dto: MarcaCreateDto) {
    try {
      const { queryString, queryParams } = MarcaCreateQuery(dto);
      const resultData: MarcaCreateResult = await this.dbService.mutationQuery(
        queryString,
        queryParams,
      );
      return processSqlResultMutation(
        resultData,
        'Operação de marca concluída com sucesso.',
        'Nenhuma marca foi alterada.',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandMarcaCreateV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível criar a marca.',
        '',
        [],
      );
    }
  }

  async taskBrandMarcaUpdateV2(dto: MarcaUpdateDto) {
    try {
      const { queryString, queryParams } = MarcaUpdateQuery(dto);
      const resultData: MarcaUpdateResult = await this.dbService.mutationQuery(
        queryString,
        queryParams,
      );
      return processSqlResultMutation(
        resultData,
        'Operação de marca concluída com sucesso.',
        'Nenhuma marca foi alterada.',
        dto.PE_ID_MARCA,
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandMarcaUpdateV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível atualizar a marca.',
        '',
        [],
      );
    }
  }

  async taskBrandMarcaDeleteV2(dto: MarcaDeleteDto) {
    try {
      const { queryString, queryParams } = MarcaDeleteQuery(dto);
      const resultData: MarcaDeleteResult = await this.dbService.mutationQuery(
        queryString,
        queryParams,
      );
      return processSqlResultMutation(
        resultData,
        'Operação de marca concluída com sucesso.',
        'Nenhuma marca foi alterada.',
        dto.PE_ID_MARCA,
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandMarcaDeleteV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível excluir a marca.',
        '',
        [],
      );
    }
  }

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
