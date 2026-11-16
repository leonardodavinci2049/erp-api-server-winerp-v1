import { IsInt, IsString, Min } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

export class MarcaUpdateDto extends BaseRequestDto {
  @Min(1)
  declare PE_ID_SYSTEM: number;

  @IsInt()
  @Min(1)
  PE_ID_MARCA: number;

  @IsString()
  PE_NOME: string;

  @IsString()
  PE_PATH_IMAGEM: string;

  @IsInt()
  PE_INATIVO: number;

  @IsString()
  PE_ANOTACOES: string;
}
