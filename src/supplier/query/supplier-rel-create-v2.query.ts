import { v4 as UuidV4 } from 'uuid';
import { SupplierRelCreateV2Dto } from '../dto/supplier-rel-create-v2.dto';

export function SupplierRelCreateV2Query(
  dataJsonDto: SupplierRelCreateV2Dto,
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
  const olSupplierId = dataJsonDto.pe_supplier_id;
  const olProductId = dataJsonDto.pe_product_id;
  const olSupplierCode = dataJsonDto.pe_supplier_code;

  const queryString = ` call sp_supplier_rel_create_v2(
        '${OlUuid}',
        ${olAppId},
        ${olSystemClientId},
        ${olStoreId},
        '${olOrganizationId}',
        '${olUserId}',
        '${olUserName}',
        '${olUserRole}',
        ${olPersonId},
        ${olSupplierId},
        ${olProductId},
        '${olSupplierCode}'
      ) `;

  return queryString;
}
