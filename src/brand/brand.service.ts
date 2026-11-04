import { Injectable } from '@nestjs/common';
import { processProcedureResultMutation } from '../core/process-result/process-procedure-result.mutation.js';
import { processProcedureResultMultiQuery } from '../core/process-result/process-procedure-result.query.js';
import { processSqlResultQuery } from '../core/process-result/process-sql-result.query.js';
import { RESPONSE_CODES } from '../core/utils/constants/globalConstants.js';
import { logServiceError } from '../core/utils/functions/log_service_error.js';
import { ResultModel } from '../core/process-result/result.model.js';
import { DbOperationService } from '../db-operation/db-operation.service.js';
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
import { BrandCreateV2Query } from './query/brand-create-v2.query.js';
import { BrandDeleteV2Query } from './query/brand-delete-v2.query.js';
import { BrandFindAllV2Query } from './query/brand-find-all-v2.query.js';
import { BrandFindIdV2Query } from './query/brand-find-id-v2.query.js';
import { BrandFindManagerAllV2Query } from './query/brand-find-manager-all-v2.query.js';
import { BrandFindManagerIdV2Query } from './query/brand-find-manager-id-v2.query.js';
import { BrandFindSearchV2Query } from './query/brand-find-search-v2.query.js';
import { BrandUpdGeneralFieldQuery } from './query/brand-upd-general-field.query.js';
import { BrandUpdInlFlagActiveV2Query } from './query/brand-upd-inl-flag-active-v2.query.js';
import { BrandUpdInlNameV2Query } from './query/brand-upd-inl-name-v2.query.js';
import { BrandUpdInlNotesV2Query } from './query/brand-upd-inl-notes-v2.query.js';
import { BrandUpdInlSlugV2Query } from './query/brand-upd-inl-slug-v2.query.js';
import { BrandUpdateV2Query } from './query/brand-update-v2.query.js';
import {
  SpResultBrandFindAllData,
  SpResultBrandFindManagerAllData,
  SpResultRecordCreateType,
  SpResultRecordUpdateType,
  TblBrandFindManagerId,
  TblBrandFindSearch,
} from './types/brand.type.js';

@Injectable()
export class BrandService {
  constructor(private readonly dbService: DbOperationService) {}

  async taskBrandCreateV2(dataJsonDto: BrandCreateV2Dto) {
    try {
      const { queryString, queryParams } = BrandCreateV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(resultData, 'Brand create failed');
    } catch (err) {
      await logServiceError('brand', 'taskBrandCreateV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível criar a marca.',
        '',
        [],
      );
    }
  }

  async taskBrandSearchAllV2(dataJsonDto: BrandFindSearchV2Dto) {
    try {
      const { queryString, queryParams } = BrandFindSearchV2Query(dataJsonDto);

      const resultData = await this.dbService.selectProcedure<TblBrandFindSearch>(
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

  async taskBrandFindAllV2(dataJsonDto: BrandFindAllV2Dto) {
    try {
      const { queryString, queryParams } = BrandFindAllV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultBrandFindAllData;

      return processProcedureResultMultiQuery(
        resultData,
        ['Brand find All'],
        'Brand find All not found',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandFindAllV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível consultar as marcas.',
        '',
        [],
      );
    }
  }

  async taskBrandFindManagerAllV2(dataJsonDto: BrandFindManagerAllV2Dto) {
    try {
      const { queryString, queryParams } =
        BrandFindManagerAllV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultBrandFindManagerAllData;

      return processProcedureResultMultiQuery(
        resultData,
        ['Brand find manager All'],
        'Brand find manager All not found',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandFindManagerAllV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível consultar as marcas.',
        '',
        [],
      );
    }
  }

  async taskBrandFindIdV2(dataJsonDto: BrandFindIdV2Dto) {
    try {
      const { queryString, queryParams } = BrandFindIdV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultBrandFindAllData;

      return processProcedureResultMultiQuery(
        resultData,
        ['Brand find All'],
        'Brand find All not found',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandFindIdV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível consultar a marca.',
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
        await this.dbService.selectProcedure<TblBrandFindManagerId>(
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

  async taskBrandUpdateV2(dataJsonDto: BrandUpdateV2Dto) {
    try {
      const { queryString, queryParams } = BrandUpdateV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(resultData, 'Brand update failed');
    } catch (err) {
      await logServiceError('brand', 'taskBrandUpdateV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível atualizar a marca.',
        '',
        [],
      );
    }
  }

  async taskBrandDeleteV2(dataJsonDto: BrandDeleteV2Dto) {
    try {
      const { queryString, queryParams } = BrandDeleteV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(resultData, 'Brand delete failed');
    } catch (err) {
      await logServiceError('brand', 'taskBrandDeleteV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível excluir a marca.',
        '',
        [],
      );
    }
  }

  async taskBrandUpdGeneralFieldV2(dataJsonDto: BrandUpdGeneralFieldDto) {
    try {
      const { queryString, queryParams } =
        BrandUpdGeneralFieldQuery(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
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

  async taskBrandUpdInlFlagActiveV2(dataJsonDto: BrandUpdInlFlagActiveV2Dto) {
    try {
      const { queryString, queryParams } =
        BrandUpdInlFlagActiveV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Brand flag active update failed',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandUpdInlFlagActiveV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível atualizar o campo da marca.',
        '',
        [],
      );
    }
  }

  async taskBrandUpdInlNameV2(dataJsonDto: BrandUpdInlNameV2Dto) {
    try {
      const { queryString, queryParams } = BrandUpdInlNameV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Brand name update failed',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandUpdInlNameV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível atualizar o campo da marca.',
        '',
        [],
      );
    }
  }

  async taskBrandUpdInlNotesV2(dataJsonDto: BrandUpdInlNotesV2Dto) {
    try {
      const { queryString, queryParams } = BrandUpdInlNotesV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Brand notes update failed',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandUpdInlNotesV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível atualizar o campo da marca.',
        '',
        [],
      );
    }
  }

  async taskBrandUpdInlSlugV2(dataJsonDto: BrandUpdInlSlugV2Dto) {
    try {
      const { queryString, queryParams } = BrandUpdInlSlugV2Query(dataJsonDto);

      const resultData = (await this.dbService.selectProcedure(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Brand slug update failed',
      );
    } catch (err) {
      await logServiceError('brand', 'taskBrandUpdInlSlugV2', err);
      return new ResultModel(
        RESPONSE_CODES.NOT_FOUND,
        'Não foi possível atualizar o campo da marca.',
        '',
        [],
      );
    }
  }
}
