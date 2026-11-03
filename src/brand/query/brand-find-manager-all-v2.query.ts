import { BrandFindManagerAllV2Dto } from '../dto/brand-find-manager-all-v2.dto.js';

export function BrandFindManagerAllV2Query(
  dataJsonDto: BrandFindManagerAllV2Dto,
): string {
  const olAppId = dataJsonDto.pe_app_id ?? 0;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id;

  const olSearch = dataJsonDto.pe_search;

  const olInactive = dataJsonDto.pe_inactive;
  const olQtRecords = dataJsonDto.pe_qt_records;
  const olPageId = dataJsonDto.pe_page_id;
  const olColumnId = dataJsonDto.pe_column_id;
  const olOrderId = dataJsonDto.pe_order_id;

  const queryString = ` call sp_brand_find_manager_all_v2(
        ${olAppId},
        ${olSystemClientId},
        ${olStoreId},
        '${olOrganizationId}',
        '${olUserId}',
        '${olUserName}',
        '${olUserRole}',
        ${olPersonId},
        '${olSearch}',
        ${olInactive},
        ${olQtRecords},
        ${olPageId},
        ${olColumnId},
        ${olOrderId}
      ) `;

  return queryString;
}
