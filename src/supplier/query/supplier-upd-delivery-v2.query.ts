import { SupplierUpdDeliveryV2Dto } from '../dto/supplier-upd-delivery-v2.dto';

interface SupplierUpdDeliveryV2QueryResult {
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
    number | null,
    number | null,
  ];
}

export function SupplierUpdDeliveryV2Query(
  dataJsonDto: SupplierUpdDeliveryV2Dto,
): SupplierUpdDeliveryV2QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olSupplierId = dataJsonDto.pe_supplier_id;
  const olDeliveryTimeDays = dataJsonDto.pe_delivery_time_days ?? null;
  const olDeliveryTimeHours = dataJsonDto.pe_delivery_time_hours ?? null;

  const queryString = `call sp_supplier_upd_delivery_v2(
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`;

  const queryParams: SupplierUpdDeliveryV2QueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olSupplierId,
    olDeliveryTimeDays,
    olDeliveryTimeHours,
  ];

  return { queryString, queryParams };
}
