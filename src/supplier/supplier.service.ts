import { Injectable } from '@nestjs/common';
import { processProcedureResultMutation } from 'src/core/process-result/process-procedure-result.mutation';
import { processProcedureResultMultiQuery } from 'src/core/process-result/process-procedure-result.query';
import { processSqlResultQuery } from 'src/core/process-result/process-sql-result.query';
import { MESSAGES } from 'src/core/utils/constants/globalConstants';
import { ResultModel } from 'src/core/utils/result.model';
import { DbOperationService } from 'src/db-operation/db-operation.service';
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
import { SupplierUpdAddressV2Dto } from './dto/supplier-upd-address-v2.dto';
import { SupplierUpdBusinessV2Dto } from './dto/supplier-upd-business-v2.dto';
import { SupplierUpdDeliveryV2Dto } from './dto/supplier-upd-delivery-v2.dto';
import { SupplierUpdGeneralFieldDto } from './dto/supplier-upd-general-field.dto';
import { SupplierUpdGeneralV2Dto } from './dto/supplier-upd-general-v2.dto';
import { SupplierUpdInlTypePersonV2Dto } from './dto/supplier-upd-inl-type-person-v2.dto';
import { SupplierUpdInternetV2Dto } from './dto/supplier-upd-internet-v2.dto';
import { SupplierUpdPersonalV2Dto } from './dto/supplier-upd-personal-v2.dto';
import { SupplierUpdateV2Dto } from './dto/supplier-update-v2.dto';
import { SupplierCreateV2Query } from './query/supplier-create-v2.query';
import { SupplierDeleteV2Query } from './query/supplier-delete-v2.query';
import { SupplierFindAllV2Query } from './query/supplier-find-all-v2.query';
import { SupplierFindIdV2Query } from './query/supplier-find-id-v2.query';
import { SupplierFindManagerAllV2Query } from './query/supplier-find-manager-all-v2.query';
import { SupplierFindManagerIdV2Query } from './query/supplier-find-manager-id-v2.query';
import { SupplierFindSearchV2Query } from './query/supplier-find-search-v2.query';
import { SupplierRelCreateV2Query } from './query/supplier-rel-create-v2.query';
import { SupplierRelDeleteV2Query } from './query/supplier-rel-delete-v2.query';
import { SupplierRelFindProdAllV2Query } from './query/supplier-rel-find-prod-all-v2.query';
import { SupplierUpdAddressV2Query } from './query/supplier-upd-address-v2.query';
import { SupplierUpdBusinessV2Query } from './query/supplier-upd-business-v2.query';
import { SupplierUpdDeliveryV2Query } from './query/supplier-upd-delivery-v2.query';
import { SupplierUpdGeneralFieldQuery } from './query/supplier-upd-general-field.query';
import { SupplierUpdGeneralV2Query } from './query/supplier-upd-general-v2.query';
import { SupplierUpdInlTypePersonV2Query } from './query/supplier-upd-inl-type-person-v2.query';
import { SupplierUpdInternetV2Query } from './query/supplier-upd-internet-v2.query';
import { SupplierUpdPersonalV2Query } from './query/supplier-upd-personal-v2.query';
import { SupplierUpdateV2Query } from './query/supplier-update-v2.query';
import {
  SpResultRecordCreateType,
  SpResultRecordDeleteType,
  SpResultRecordUpdateType,
  SpResultSupplierFindAllData,
  SpResultSupplierFindIdData,
  SpResultSupplierFindManagerAllData,
  TblSupplierFindManagerId,
  TblSupplierFindSearch,
} from './types/supplier.type';

@Injectable()
export class SupplierService {
  constructor(private readonly dbOperationService: DbOperationService) {}

  async taskSupplierCreateV2(dataJsonDto: SupplierCreateV2Dto) {
    try {
      const queryString = SupplierCreateV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier create failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierRelCreateV2(dataJsonDto: SupplierRelCreateV2Dto) {
    try {
      const queryString = SupplierRelCreateV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordCreateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier relationship create failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierFindAllV2(dataJsonDto: SupplierFindAllV2Dto) {
    try {
      const queryString = SupplierFindAllV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
      )) as unknown as SpResultSupplierFindAllData;

      return processProcedureResultMultiQuery(
        resultData,
        ['Supplier find All'],
        'Supplier find All not found',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierSearchAllV2(dataJsonDto: SupplierFindSearchV2Dto) {
    try {
      const { queryString, queryParams } =
        SupplierFindSearchV2Query(dataJsonDto);

      const resultData =
        await this.dbOperationService.selectQuery<TblSupplierFindSearch>(
          queryString,
          queryParams,
        );

      return processSqlResultQuery(
        resultData,
        'Supplier find All',
        'Supplier find All not found',
        'Dados carregados com sucesso.',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierFindManagerAllV2(dataJsonDto: SupplierFindManagerAllV2Dto) {
    try {
      const queryString = SupplierFindManagerAllV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
      )) as unknown as SpResultSupplierFindManagerAllData;

      return processProcedureResultMultiQuery(
        resultData,
        ['Supplier find manager All'],
        'Supplier find manager All not found',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

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
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierRelFindProdAllV2(dataJsonDto: SupplierRelFindProdAllV2Dto) {
    try {
      const queryString = SupplierRelFindProdAllV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
      )) as unknown as SpResultSupplierFindAllData;

      return processProcedureResultMultiQuery(
        resultData,
        ['Supplier relationship find All'],
        'Customer find Allnot found',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierFindIdV2(dataJsonDto: SupplierFindIdV2Dto) {
    try {
      const { queryString, queryParams } = SupplierFindIdV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultSupplierFindIdData;

      return processProcedureResultMultiQuery(
        resultData,
        ['Supplier find Id'],
        'Supplier find Id not found',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdateV2(dataJsonDto: SupplierUpdateV2Dto) {
    try {
      const queryString = SupplierUpdateV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierRelDeleteV2(dataJsonDto: SupplierRelDeleteV2Dto) {
    try {
      const queryString = SupplierRelDeleteV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordDeleteType;

      return processProcedureResultMutation(
        resultData,
        'Supplier relationship delete failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierDeleteV2(dataJsonDto: SupplierDeleteV2Dto) {
    try {
      const queryString = SupplierDeleteV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
      )) as unknown as SpResultRecordDeleteType;

      return processProcedureResultMutation(
        resultData,
        'Supplier delete failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdGeneralFieldV2(dataJsonDto: SupplierUpdGeneralFieldDto) {
    try {
      const { queryString, queryParams } =
        SupplierUpdGeneralFieldQuery(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier field update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdAddressV2(dataJsonDto: SupplierUpdAddressV2Dto) {
    try {
      const { queryString, queryParams } =
        SupplierUpdAddressV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier address update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdBusinessV2(dataJsonDto: SupplierUpdBusinessV2Dto) {
    try {
      const { queryString, queryParams } =
        SupplierUpdBusinessV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier business update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdDeliveryV2(dataJsonDto: SupplierUpdDeliveryV2Dto) {
    try {
      const { queryString, queryParams } =
        SupplierUpdDeliveryV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier delivery update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdGeneralV2(dataJsonDto: SupplierUpdGeneralV2Dto) {
    try {
      const { queryString, queryParams } =
        SupplierUpdGeneralV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier general update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdInlTypePersonV2(
    dataJsonDto: SupplierUpdInlTypePersonV2Dto,
  ) {
    try {
      const { queryString, queryParams } =
        SupplierUpdInlTypePersonV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier person type update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdInternetV2(dataJsonDto: SupplierUpdInternetV2Dto) {
    try {
      const { queryString, queryParams } =
        SupplierUpdInternetV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier internet update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  async taskSupplierUpdPersonalV2(dataJsonDto: SupplierUpdPersonalV2Dto) {
    try {
      const { queryString, queryParams } =
        SupplierUpdPersonalV2Query(dataJsonDto);

      const resultData = (await this.dbOperationService.selectExecute(
        queryString,
        queryParams,
      )) as unknown as SpResultRecordUpdateType;

      return processProcedureResultMutation(
        resultData,
        'Supplier personal update failed',
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }
}
