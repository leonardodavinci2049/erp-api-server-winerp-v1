import { BrandUpdGeneralFieldDto } from '../dto/brand-upd-general-field.dto.js';

interface BrandUpdGeneralFieldQueryResult {
  procedureName: string;
  queryParams: [
    number,
    number,
    number,
    string,
    number,
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

export function BrandUpdGeneralFieldQuery(
  dataJsonDto: BrandUpdGeneralFieldDto,
): BrandUpdGeneralFieldQueryResult {
  const olAppId = dataJsonDto.pe_app_id ?? 1;
  const olSystemClientId = dataJsonDto.PE_ID_SYSTEM;
  const olStoreId = dataJsonDto.PE_ID_LOJA;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.PE_ID_USUARIO;
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

  const procedureName = 'sp_brand_upd_general_field_v2';

  const queryParams: BrandUpdGeneralFieldQueryResult['queryParams'] = [
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

  return { procedureName, queryParams };
}
