import type { BrandFindIdV2Dto } from '../dto/brand-find-id-v2.dto.js';

interface QueryResult {
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
  ];
}

export function BrandFindIdV2Query(dataJsonDto: BrandFindIdV2Dto): QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olBrandId = dataJsonDto.pe_brand_id;

  const queryString = 'call sp_brand_find_id_v2(?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const queryParams: QueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olBrandId,
  ];

  return { queryString, queryParams };
}
