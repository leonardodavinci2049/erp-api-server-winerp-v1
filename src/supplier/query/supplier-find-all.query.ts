import { SupplierFindAllDto } from '../dto/supplier-find-all.dto';

export function SupplierFindAllQuery(dataJsonDto: SupplierFindAllDto): string {
  const olAppId = dataJsonDto.pe_app_id ?? 1;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserId = dataJsonDto.pe_user_id;
  const olPersonId = dataJsonDto.pe_person_id;

  const olIdSupplier = dataJsonDto.pe_id_fornecedor;
  const olSupplier = dataJsonDto.pe_fornecedor;
  const olLimit = dataJsonDto.pe_limit;

  const queryString = ` call sp_supplier_sel_all_v2(
        ${olAppId},
        ${olSystemClientId},
        ${olStoreId},
        '${olOrganizationId}',
        '${olUserName}',
        '${olUserId}',
        ${olPersonId},
        ${olIdSupplier},
        '${olSupplier}',
        ${olLimit}



      ) `;

  return queryString;
}
