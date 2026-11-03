import { IsNotEmpty, IsString } from 'class-validator';

import { EndpointContextDto } from '../../core/dto/endpoint-context.dto.js';

export class BrandCreateV2Dto extends EndpointContextDto {

  @IsString()
  @IsNotEmpty()
  pe_brand!: string;

  @IsString()
  pe_image_path!: string;

  @IsString()
  pe_notes!: string;
}

/*
Sample JSON for testing in body endpoint:
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_organization_id": "ORG001",
  "pe_user_id": "USER001",
  "pe_user_name": "John Doe",
  "pe_user_role": "saller",
  "pe_person_id": 29014,
  "pe_brand": "Brand Name5",
  "pe_image_path": "path/to/image",
  "pe_notes": "Some notes"
}




*/
