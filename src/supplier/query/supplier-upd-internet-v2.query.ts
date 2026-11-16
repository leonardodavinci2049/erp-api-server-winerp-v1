import { SupplierUpdInternetV2Dto } from '../dto/supplier-upd-internet-v2.dto';

interface SupplierUpdInternetV2QueryResult {
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
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
  ];
}

export function SupplierUpdInternetV2Query(
  dataJsonDto: SupplierUpdInternetV2Dto,
): SupplierUpdInternetV2QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olSupplierId = dataJsonDto.pe_supplier_id;
  const olWebsite = dataJsonDto.pe_website ?? null;
  const olInstagram = dataJsonDto.pe_instagram ?? null;
  const olMap = dataJsonDto.pe_map ?? null;
  const olFacebook = dataJsonDto.pe_facebook ?? null;
  const olTwitter = dataJsonDto.pe_twitter ?? null;

  const queryString = `call sp_supplier_upd_internet_v2(
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

  const queryParams: SupplierUpdInternetV2QueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olSupplierId,
    olWebsite,
    olInstagram,
    olMap,
    olFacebook,
    olTwitter,
  ];

  return { queryString, queryParams };
}
