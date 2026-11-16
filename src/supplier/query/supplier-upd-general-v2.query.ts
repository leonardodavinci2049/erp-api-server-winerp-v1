import { SupplierUpdGeneralV2Dto } from '../dto/supplier-upd-general-v2.dto';

interface SupplierUpdGeneralV2QueryResult {
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
    string,
    string | null,
    string | null,
    string | null,
    string | null,
  ];
}

export function SupplierUpdGeneralV2Query(
  dataJsonDto: SupplierUpdGeneralV2Dto,
): SupplierUpdGeneralV2QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olSupplierId = dataJsonDto.pe_supplier_id;
  const olName = dataJsonDto.pe_name;
  const olPhone1 = dataJsonDto.pe_phone1 ?? null;
  const olWhatsapp1 = dataJsonDto.pe_whatsapp1 ?? null;
  const olContact1 = dataJsonDto.pe_contact1 ?? null;
  const olEmail1 = dataJsonDto.pe_email1 ?? null;

  const queryString = `call sp_supplier_upd_general_v2(
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
        ?,
        ?,
        ?,
        ?
      )`;

  const queryParams: SupplierUpdGeneralV2QueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olSupplierId,
    olName,
    olPhone1,
    olWhatsapp1,
    olContact1,
    olEmail1,
  ];

  return { queryString, queryParams };
}
