import { v4 as UuidV4 } from 'uuid';
import { generateSlug } from '../../core/utils/generators/generate-slug.js';
import type { BrandCreateV2Dto } from '../dto/brand-create-v2.dto.js';

interface QueryResult {
  queryString: string;
  queryParams: [
    string,
    number,
    number,
    number,
    string,
    string,
    string,
    string,
    number | null,
    string,
    string,
    string,
    string,
  ];
}

export function BrandCreateV2Query(dataJsonDto: BrandCreateV2Dto): QueryResult {
  const olUuid = UuidV4();
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olBrand = dataJsonDto.pe_brand;
  const olSlug = generateSlug(dataJsonDto.pe_brand);
  const olImagePath = dataJsonDto.pe_image_path;
  const olNotes = dataJsonDto.pe_notes;

  const queryString =
    'call sp_brand_create_v2(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const queryParams: QueryResult['queryParams'] = [
    olUuid,
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olBrand,
    olSlug,
    olImagePath,
    olNotes,
  ];

  return { queryString, queryParams };
}
