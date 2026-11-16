import { IsInt, IsString, Min } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

export class MarcaFindAllDto extends BaseRequestDto {
  @Min(1)
  declare PE_ID_SYSTEM: number;

  @IsInt()
  PE_ID_MARCA: number;

  @IsString()
  PE_MARCA: string;
}
