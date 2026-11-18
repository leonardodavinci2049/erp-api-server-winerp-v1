import { IsNumber, IsDefined, IsString, Min } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

/**
 * Request of `fornecedor-update`, ported from `acceptFornecedorV1`
 * (`UsvmFornecedor.pas`).
 */
export class FornecedorUpdateDto extends BaseRequestDto {
  @Min(1, { message: 'PE_ID_SYSTEM deve ser maior ou igual a 1.' })
  declare PE_ID_SYSTEM: number;

  @IsNumber()
  @IsDefined()
  PE_ID_CATEGORIA!: number;

  @IsNumber()
  @IsDefined()
  PE_ID_TIPO!: number;

  @IsString()
  @IsDefined()
  PE_FISIJURI!: string;

  @IsString()
  @IsDefined()
  PE_FONE1!: string;

  @IsString()
  @IsDefined()
  PE_FONE2!: string;

  @IsString()
  @IsDefined()
  PE_WHATAPP1!: string;

  @IsString()
  @IsDefined()
  PE_WHATAPP2!: string;

  @IsString()
  @IsDefined()
  PE_CONTATO1!: string;

  @IsString()
  @IsDefined()
  PE_CONTATO2!: string;

  @IsString()
  @IsDefined()
  PE_SETOR1!: string;

  @IsString()
  @IsDefined()
  PE_SETOR2!: string;

  @IsString()
  @IsDefined()
  PE_EMAIL1!: string;

  @IsString()
  @IsDefined()
  PE_EMAIL2!: string;

  @IsString()
  @IsDefined()
  PE_RAZAO_SOCIAL!: string;

  @IsString()
  @IsDefined()
  PE_CNPJ!: string;

  @IsString()
  @IsDefined()
  PE_INSC_ESTADUAL!: string;

  @IsString()
  @IsDefined()
  PE_INSC_MUNICIPAL!: string;

  @IsString()
  @IsDefined()
  PE_NOME_FANTASIA!: string;

  @IsString()
  @IsDefined()
  PE_DATA_CNPJ!: string;

  @IsString()
  @IsDefined()
  PE_NOME_RESPONSAVEL!: string;

  @IsString()
  @IsDefined()
  PE_CARGO_RESPOSNAVEL!: string;

  @IsString()
  @IsDefined()
  PE_ATIVIDADE_PRINCIPAL!: string;

  @IsString()
  @IsDefined()
  PE_ATIVIDADES_SECUNDARIA1!: string;

  @IsString()
  @IsDefined()
  PE_ATIVIDADES_SECUNDARIA2!: string;

  @IsString()
  @IsDefined()
  PE_ATIVIDADES_SECUNDARIA3!: string;

  @IsString()
  @IsDefined()
  PE_ATIVIDADES_SECUNDARIA4!: string;

  @IsString()
  @IsDefined()
  PE_ATIVIDADES_SECUNDARIA5!: string;

  @IsString()
  @IsDefined()
  PE_NATUREZA_JURIDICA!: string;

  @IsString()
  @IsDefined()
  PE_OBJETIVO_MISSAO!: string;

  @IsString()
  @IsDefined()
  PE_MISSAO_VISAO!: string;

  @IsString()
  @IsDefined()
  PE_PRIMEIRO_NOME!: string;

  @IsString()
  @IsDefined()
  PE_CARGO!: string;

  @IsString()
  @IsDefined()
  PE_CPF!: string;

  @IsString()
  @IsDefined()
  PE_RG!: string;

  @IsString()
  @IsDefined()
  PE_GENERO!: string;

  @IsString()
  @IsDefined()
  PE_SOBRENOME!: string;

  @IsString()
  @IsDefined()
  PE_NOME_DO_MEIO!: string;

  @IsString()
  @IsDefined()
  PE_TRATAMENTO!: string;

  @IsString()
  @IsDefined()
  PE_TRABALHANAEMPRESA!: string;

  @IsString()
  @IsDefined()
  PE_FORMACAOACADEMICA!: string;

  @IsString()
  @IsDefined()
  PE_FORMACAOATUAL!: string;

  @IsString()
  @IsDefined()
  PE_ESPECIALIZACAO!: string;

  @IsString()
  @IsDefined()
  PE_INSTITUICAODEENSINO!: string;

  @IsString()
  @IsDefined()
  PE_CONJUGUE!: string;

  @IsString()
  @IsDefined()
  PE_DATADONASCIMENTO!: string;

  @IsString()
  @IsDefined()
  PE_CEP!: string;

  @IsString()
  @IsDefined()
  PE_ENDERECO!: string;

  @IsString()
  @IsDefined()
  PE_ENDERECO_NUMERO!: string;

  @IsString()
  @IsDefined()
  PE_COMPLEMENTO!: string;

  @IsString()
  @IsDefined()
  PE_BAIRRO!: string;

  @IsString()
  @IsDefined()
  PE_CIDADE!: string;

  @IsString()
  @IsDefined()
  PE_UF!: string;

  @IsString()
  @IsDefined()
  PE_REGIAO_PAIS!: string;

  @IsString()
  @IsDefined()
  PE_PAIS!: string;

  @IsNumber()
  @IsDefined()
  PE_COD_MUNICIPIO!: number;

  @IsNumber()
  @IsDefined()
  PE_COD_UF!: number;

  @IsString()
  @IsDefined()
  PE_WEBSITE!: string;

  @IsString()
  @IsDefined()
  PE_SKYPE!: string;

  @IsString()
  @IsDefined()
  PE_FACEBOOK!: string;

  @IsString()
  @IsDefined()
  PE_TWITTER!: string;

  @IsString()
  @IsDefined()
  PE_ANOTACOES!: string;

  @IsNumber()
  PE_ID_FORNECEDOR!: number;

  @IsString()
  @IsDefined()
  PE_NOME!: string;
}

/*
Sample JSON for testing in body endpoint:

{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": 1,
  "PE_ID_CATEGORIA": 0,
  "PE_ID_TIPO": 0,
  "PE_FISIJURI": "J",
  "PE_FONE1": "",
  "PE_FONE2": "",
  "PE_WHATAPP1": "",
  "PE_WHATAPP2": "",
  "PE_CONTATO1": "",
  "PE_CONTATO2": "",
  "PE_SETOR1": "",
  "PE_SETOR2": "",
  "PE_EMAIL1": "",
  "PE_EMAIL2": "",
  "PE_RAZAO_SOCIAL": "FORNECEDOR PADRAO API LTDA",
  "PE_CNPJ": "00000000000100",
  "PE_INSC_ESTADUAL": "",
  "PE_INSC_MUNICIPAL": "",
  "PE_NOME_FANTASIA": "",
  "PE_DATA_CNPJ": "",
  "PE_NOME_RESPONSAVEL": "",
  "PE_CARGO_RESPOSNAVEL": "",
  "PE_ATIVIDADE_PRINCIPAL": "",
  "PE_ATIVIDADES_SECUNDARIA1": "",
  "PE_ATIVIDADES_SECUNDARIA2": "",
  "PE_ATIVIDADES_SECUNDARIA3": "",
  "PE_ATIVIDADES_SECUNDARIA4": "",
  "PE_ATIVIDADES_SECUNDARIA5": "",
  "PE_NATUREZA_JURIDICA": "",
  "PE_OBJETIVO_MISSAO": "",
  "PE_MISSAO_VISAO": "",
  "PE_PRIMEIRO_NOME": "",
  "PE_CARGO": "",
  "PE_CPF": "",
  "PE_RG": "",
  "PE_GENERO": "",
  "PE_SOBRENOME": "",
  "PE_NOME_DO_MEIO": "",
  "PE_TRATAMENTO": "",
  "PE_TRABALHANAEMPRESA": "",
  "PE_FORMACAOACADEMICA": "",
  "PE_FORMACAOATUAL": "",
  "PE_ESPECIALIZACAO": "",
  "PE_INSTITUICAODEENSINO": "",
  "PE_CONJUGUE": "",
  "PE_DATADONASCIMENTO": "",
  "PE_CEP": "",
  "PE_ENDERECO": "",
  "PE_ENDERECO_NUMERO": "",
  "PE_COMPLEMENTO": "",
  "PE_BAIRRO": "",
  "PE_CIDADE": "",
  "PE_UF": "SP",
  "PE_REGIAO_PAIS": "",
  "PE_PAIS": "",
  "PE_COD_MUNICIPIO": 0,
  "PE_COD_UF": 0,
  "PE_WEBSITE": "",
  "PE_SKYPE": "",
  "PE_FACEBOOK": "",
  "PE_TWITTER": "",
  "PE_ANOTACOES": "",
  "PE_ID_FORNECEDOR": 1,
  "PE_NOME": "FORNECEDOR PADRAO API"
}

*/
