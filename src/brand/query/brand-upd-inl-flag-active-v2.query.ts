import { BrandUpdInlFlagActiveV2Dto } from '../dto/brand-upd-inl-flag-active-v2.dto.js';

interface BrandUpdInlFlagActiveV2QueryResult {
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
  ];
}

export function BrandUpdInlFlagActiveV2Query(
  dataJsonDto: BrandUpdInlFlagActiveV2Dto,
): BrandUpdInlFlagActiveV2QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olBrandId = dataJsonDto.pe_brand_id;
  const olInactive = dataJsonDto.pe_inactive;

  const queryString = `call sp_brand_upd_inl_flag_active_v2(
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

  const queryParams: BrandUpdInlFlagActiveV2QueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olBrandId,
    olInactive,
  ];

  return { queryString, queryParams };
}
