import { IsNumber, IsOptional, IsString } from 'class-validator';

import { FornecedorPanelDto } from './fornecedor-panel.dto.js';

/**
 * Legacy supplier payload shared by the create and update operations mapped
 * from `updateFornecedorV1` and `acceptFornecedorV1`.
 *
 * Every field keeps the original DataSnap casing. `PE_NOME` is declared by the
 * concrete DTOs because the create operation validates its minimum length
 * while the update operation does not.
 */
export class FornecedorPayloadDto extends FornecedorPanelDto {
  @IsNumber()
  @IsOptional()
  PE_ID_CATEGORIA?: number | null;

  @IsNumber()
  @IsOptional()
  PE_ID_TIPO?: number | null;

  @IsString()
  @IsOptional()
  PE_FISIJURI?: string | null;

  @IsString()
  @IsOptional()
  PE_FONE1?: string | null;

  @IsString()
  @IsOptional()
  PE_FONE2?: string | null;

  @IsString()
  @IsOptional()
  PE_WHATAPP1?: string | null;

  @IsString()
  @IsOptional()
  PE_WHATAPP2?: string | null;

  @IsString()
  @IsOptional()
  PE_CONTATO1?: string | null;

  @IsString()
  @IsOptional()
  PE_CONTATO2?: string | null;

  @IsString()
  @IsOptional()
  PE_SETOR1?: string | null;

  @IsString()
  @IsOptional()
  PE_SETOR2?: string | null;

  @IsString()
  @IsOptional()
  PE_EMAIL1?: string | null;

  @IsString()
  @IsOptional()
  PE_EMAIL2?: string | null;

  @IsString()
  @IsOptional()
  PE_RAZAO_SOCIAL?: string | null;

  @IsString()
  @IsOptional()
  PE_CNPJ?: string | null;

  @IsString()
  @IsOptional()
  PE_INSC_ESTADUAL?: string | null;

  @IsString()
  @IsOptional()
  PE_INSC_MUNICIPAL?: string | null;

  @IsString()
  @IsOptional()
  PE_NOME_FANTASIA?: string | null;

  @IsString()
  @IsOptional()
  PE_DATA_CNPJ?: string | null;

  @IsString()
  @IsOptional()
  PE_NOME_RESPONSAVEL?: string | null;

  @IsString()
  @IsOptional()
  PE_CARGO_RESPOSNAVEL?: string | null;

  @IsString()
  @IsOptional()
  PE_ATIVIDADE_PRINCIPAL?: string | null;

  @IsString()
  @IsOptional()
  PE_ATIVIDADES_SECUNDARIA1?: string | null;

  @IsString()
  @IsOptional()
  PE_ATIVIDADES_SECUNDARIA2?: string | null;

  @IsString()
  @IsOptional()
  PE_ATIVIDADES_SECUNDARIA3?: string | null;

  @IsString()
  @IsOptional()
  PE_ATIVIDADES_SECUNDARIA4?: string | null;

  @IsString()
  @IsOptional()
  PE_ATIVIDADES_SECUNDARIA5?: string | null;

  @IsString()
  @IsOptional()
  PE_NATUREZA_JURIDICA?: string | null;

  @IsString()
  @IsOptional()
  PE_OBJETIVO_MISSAO?: string | null;

  @IsString()
  @IsOptional()
  PE_MISSAO_VISAO?: string | null;

  @IsString()
  @IsOptional()
  PE_PRIMEIRO_NOME?: string | null;

  @IsString()
  @IsOptional()
  PE_CARGO?: string | null;

  @IsString()
  @IsOptional()
  PE_CPF?: string | null;

  @IsString()
  @IsOptional()
  PE_RG?: string | null;

  @IsString()
  @IsOptional()
  PE_GENERO?: string | null;

  @IsString()
  @IsOptional()
  PE_SOBRENOME?: string | null;

  @IsString()
  @IsOptional()
  PE_NOME_DO_MEIO?: string | null;

  @IsString()
  @IsOptional()
  PE_TRATAMENTO?: string | null;

  @IsString()
  @IsOptional()
  PE_TRABALHANAEMPRESA?: string | null;

  @IsString()
  @IsOptional()
  PE_FORMACAOACADEMICA?: string | null;

  @IsString()
  @IsOptional()
  PE_FORMACAOATUAL?: string | null;

  @IsString()
  @IsOptional()
  PE_ESPECIALIZACAO?: string | null;

  @IsString()
  @IsOptional()
  PE_INSTITUICAODEENSINO?: string | null;

  @IsString()
  @IsOptional()
  PE_CONJUGUE?: string | null;

  @IsString()
  @IsOptional()
  PE_DATADONASCIMENTO?: string | null;

  @IsString()
  @IsOptional()
  PE_CEP?: string | null;

  @IsString()
  @IsOptional()
  PE_ENDERECO?: string | null;

  @IsString()
  @IsOptional()
  PE_ENDERECO_NUMERO?: string | null;

  @IsString()
  @IsOptional()
  PE_COMPLEMENTO?: string | null;

  @IsString()
  @IsOptional()
  PE_BAIRRO?: string | null;

  @IsString()
  @IsOptional()
  PE_CIDADE?: string | null;

  @IsString()
  @IsOptional()
  PE_UF?: string | null;

  @IsString()
  @IsOptional()
  PE_REGIAO_PAIS?: string | null;

  @IsString()
  @IsOptional()
  PE_PAIS?: string | null;

  @IsNumber()
  @IsOptional()
  PE_COD_MUNICIPIO?: number | null;

  @IsNumber()
  @IsOptional()
  PE_COD_UF?: number | null;

  @IsString()
  @IsOptional()
  PE_WEBSITE?: string | null;

  @IsString()
  @IsOptional()
  PE_SKYPE?: string | null;

  @IsString()
  @IsOptional()
  PE_FACEBOOK?: string | null;

  @IsString()
  @IsOptional()
  PE_TWITTER?: string | null;

  @IsString()
  @IsOptional()
  PE_ANOTACOES?: string | null;
}
