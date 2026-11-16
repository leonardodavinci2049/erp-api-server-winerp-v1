import { IsString, MinLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

export class MarcaCreateDto extends BaseRequestDto {
  @Min(1)
  declare PE_ID_SYSTEM: number;

  @IsString()
  @MinLength(5)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/null/gi, '') : value,
  )
  PE_NOME: string;

  @IsString()
  PE_PASTA_IMG: string;

  @IsString()
  PE_ANOTACOES: string;
}
