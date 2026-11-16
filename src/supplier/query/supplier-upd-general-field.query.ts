import { SupplierUpdGeneralFieldDto } from '../dto/supplier-upd-general-field.dto';

interface SupplierUpdGeneralFieldQueryResult {
  queryString: string;
  queryParams: [
    number,
    number,
    number,
    string,
    string,
    string,
    string,
    number | null,
    number,
    number,
    string,
    string | null,
    number | null,
    number | null,
    string | null,
  ];
}

export function SupplierUpdGeneralFieldQuery(
  dataJsonDto: SupplierUpdGeneralFieldDto,
): SupplierUpdGeneralFieldQueryResult {
  const olAppId = dataJsonDto.pe_app_id ?? 1;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olRegisterId = dataJsonDto.pe_register_id;
  const olFieldType = dataJsonDto.pe_field_type;
  const olField = dataJsonDto.pe_field;
  const olValueStr = dataJsonDto.pe_value_str ?? null;
  const olValueInt = dataJsonDto.pe_value_int ?? null;
  const olValueNumeric = dataJsonDto.pe_value_numeric ?? null;
  const olValueDate = dataJsonDto.pe_value_date ?? null;

  const queryString = `call sp_supplier_upd_general_field_v2(
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`;

  const queryParams: SupplierUpdGeneralFieldQueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olRegisterId,
    olFieldType,
    olField,
    olValueStr,
    olValueInt,
    olValueNumeric,
    olValueDate,
  ];

  return { queryString, queryParams };
}
