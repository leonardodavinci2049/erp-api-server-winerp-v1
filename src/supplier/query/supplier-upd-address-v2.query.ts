import { SupplierUpdAddressV2Dto } from '../dto/supplier-upd-address-v2.dto';

interface SupplierUpdAddressV2QueryResult {
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
    string | null,
    string | null,
    string | null,
    string | null,
    number | null,
    number | null,
  ];
}

export function SupplierUpdAddressV2Query(
  dataJsonDto: SupplierUpdAddressV2Dto,
): SupplierUpdAddressV2QueryResult {
  const olAppId = dataJsonDto.pe_app_id;
  const olSystemClientId = dataJsonDto.pe_system_client_id;
  const olStoreId = dataJsonDto.pe_store_id;
  const olOrganizationId = dataJsonDto.pe_organization_id;
  const olUserId = dataJsonDto.pe_user_id;
  const olUserName = dataJsonDto.pe_user_name;
  const olUserRole = dataJsonDto.pe_user_role;
  const olPersonId = dataJsonDto.pe_person_id ?? null;
  const olSupplierId = dataJsonDto.pe_supplier_id;
  const olPostalCode = dataJsonDto.pe_postal_code ?? null;
  const olAddress = dataJsonDto.pe_address ?? null;
  const olAddressNumber = dataJsonDto.pe_address_number ?? null;
  const olAddressComplement = dataJsonDto.pe_address_complement ?? null;
  const olNeighborhood = dataJsonDto.pe_neighborhood ?? null;
  const olCity = dataJsonDto.pe_city ?? null;
  const olStateAbbreviation = dataJsonDto.pe_state_abbreviation ?? null;
  const olCountryRegion = dataJsonDto.pe_country_region ?? null;
  const olCountry = dataJsonDto.pe_country ?? null;
  const olMunicipalityCode = dataJsonDto.pe_municipality_code ?? null;
  const olStateCode = dataJsonDto.pe_state_code ?? null;

  const queryString = `call sp_supplier_upd_address_v2(
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
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )`;

  const queryParams: SupplierUpdAddressV2QueryResult['queryParams'] = [
    olAppId,
    olSystemClientId,
    olStoreId,
    olOrganizationId,
    olUserId,
    olUserName,
    olUserRole,
    olPersonId,
    olSupplierId,
    olPostalCode,
    olAddress,
    olAddressNumber,
    olAddressComplement,
    olNeighborhood,
    olCity,
    olStateAbbreviation,
    olCountryRegion,
    olCountry,
    olMunicipalityCode,
    olStateCode,
  ];

  return { queryString, queryParams };
}
