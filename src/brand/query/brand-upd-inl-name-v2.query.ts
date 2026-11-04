import { BrandUpdInlNameV2Dto } from '../dto/brand-upd-inl-name-v2.dto.js';

interface BrandUpdInlNameV2QueryResult {
  procedureName: string;
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
    string,
  ];
}

export function BrandUpdInlNameV2Query(
  dataJsonDto: BrandUpdInlNameV2Dto,
): BrandUpdInlNameV2QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olBrandId = dataJsonDto.pe_brand_id;
  const olBrandName = dataJsonDto.pe_brand_name;

  const procedureName = 'sp_brand_upd_inl_name_v2';

  const queryParams: BrandUpdInlNameV2QueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olBrandId,
    olBrandName,
  ];

  return { procedureName, queryParams };
}
