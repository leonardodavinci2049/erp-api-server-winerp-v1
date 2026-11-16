import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * Legacy DataSnap panel fields shared by the supplier endpoints ported from
 * `UsvmFornecedor.pas`. The original names are kept on purpose so existing
 * DataSnap payloads keep working while the client migrates to Nest.js.
 */
export class FornecedorPanelDto {
  @IsString()
  @IsOptional()
  pePassKey?: string | null;

  @IsNumber()
  @Min(1, { message: 'peIdSystem deve ser maior ou igual a 1.' })
  peIdSystem!: number;

  @IsNumber()
  @IsOptional()
  peIdLoja?: number | null;

  @IsNumber()
  @IsOptional()
  peIdDepartamento?: number | null;

  @IsNumber()
  @IsOptional()
  peIdUsuario?: number | null;
}
