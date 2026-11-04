import { generateSlug } from '../../core/utils/generators/generate-slug.js';
import type { BrandUpdateV2Dto } from '../dto/brand-update-v2.dto.js';

interface QueryResult {
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
    string,
    string,
    string,
    number,
  ];
}

export function BrandUpdateV2Query(dataJsonDto: BrandUpdateV2Dto): QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olBrandId = dataJsonDto.pe_brand_id;
  const olBrand = dataJsonDto.pe_brand;
  const olSlug = generateSlug(dataJsonDto.pe_brand);
  const olImagePath = dataJsonDto.pe_image_path;
  const olNotes = dataJsonDto.pe_notes;
  const olInactive = dataJsonDto.pe_inactive;

  const procedureName = 'sp_brand_update_v2';
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
    olBrand,
    olSlug,
    olImagePath,
    olNotes,
    olInactive,
  ];

  return { procedureName, queryParams };
}
