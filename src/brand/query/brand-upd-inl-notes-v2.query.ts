import { BrandUpdInlNotesV2Dto } from '../dto/brand-upd-inl-notes-v2.dto.js';

interface BrandUpdInlNotesV2QueryResult {
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
    string | null,
  ];
}

export function BrandUpdInlNotesV2Query(
  dataJsonDto: BrandUpdInlNotesV2Dto,
): BrandUpdInlNotesV2QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olBrandId = dataJsonDto.pe_brand_id;
  const olNotes = dataJsonDto.pe_notes ?? null;

  const procedureName = 'sp_brand_upd_inl_notes_v2';

  const queryParams: BrandUpdInlNotesV2QueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olBrandId,
    olNotes,
  ];

  return { procedureName, queryParams };
}
