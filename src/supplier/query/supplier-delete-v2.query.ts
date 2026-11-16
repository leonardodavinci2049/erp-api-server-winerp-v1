import { SupplierDeleteV2Dto } from '../dto/supplier-delete-v2.dto';

export function SupplierDeleteV2Query(
  dataJsonDto: SupplierDeleteV2Dto,
): string {
  const olAppId = dataJsonDto.pe_app_id ?? 1;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;

  const olPersonId = dataJsonDto.pe_person_id;
  const olSupplierId = dataJsonDto.pe_supplier_id;

  const queryString = ` call sp_supplier_delete_v2(
        ${olAppId},
        ${olSystemClientId},
        ${olStoreId},
        '${olOrganizationId}',
        '${olUserId}',
        '${olUserName}',
        '${olUserRole}',
        ${olPersonId},
          ${olSupplierId}
      ) `;

  return queryString;
}
