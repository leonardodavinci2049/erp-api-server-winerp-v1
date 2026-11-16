import { IsInt, Min } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

export class MarcaDeleteDto extends BaseRequestDto {
  @Min(1)
  declare PE_ID_SYSTEM: number;

  @IsInt()
  @Min(1)
  PE_ID_MARCA: number;
}
