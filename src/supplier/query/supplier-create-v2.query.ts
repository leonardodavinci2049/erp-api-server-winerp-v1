import { v4 as UuidV4 } from 'uuid';
import { SupplierCreateV2Dto } from '../dto/supplier-create-v2.dto';

// 36960
export function SupplierCreateV2Query(
  dataJsonDto: SupplierCreateV2Dto,
): string {
  const OlUuid = UuidV4();
  const olAppId = dataJsonDto.pe_app_id ?? 1;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id;
  const olSupplierName = dataJsonDto.pe_supplier_name;
  const olSlug = dataJsonDto.pe_slug;

  const queryString = ` call sp_supplier_create_v2(
        '${OlUuid}',
        ${olAppId},
        ${olSystemClientId},
        ${olStoreId},
        '${olOrganizationId}',
        '${olUserId}',
        '${olUserName}',
        '${olUserRole}',	
        ${olPersonId},
        '${olSupplierName}',
        '${olSlug}'
      ) `;

  return queryString;
}
