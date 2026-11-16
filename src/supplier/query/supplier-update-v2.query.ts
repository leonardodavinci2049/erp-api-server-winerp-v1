import { SupplierUpdateV2Dto } from '../dto/supplier-update-v2.dto';

export function SupplierUpdateV2Query(
  dataJsonDto: SupplierUpdateV2Dto,
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
  const olSupplier = dataJsonDto.pe_supplier;
  const olNotes = dataJsonDto.pe_notes;
  const olInactive = dataJsonDto.pe_inactive;

  const queryString = ` call sp_supplier_update_v2(
        ${olAppId},
        ${olSystemClientId},
        ${olStoreId},
        '${olOrganizationId}',
        '${olUserId}',
        '${olUserName}',
        '${olUserRole}',		
        ${olPersonId},
        ${olSupplierId},
        '${olSupplier}',
        '${olNotes}',
        ${olInactive}

      ) `;

  return queryString;
}
