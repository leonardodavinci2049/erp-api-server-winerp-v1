import 'reflect-metadata';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';
import { FornecedorCreateDto } from './fornecedor-create.dto.js';
import { FornecedorDeleteDto } from './fornecedor-delete.dto.js';
import { FornecedorFindAllDto } from './fornecedor-find-all.dto.js';
import { FornecedorProductFindIdDto } from './fornecedor-product-find-id.dto.js';
import { FornecedorUpdateDto } from './fornecedor-update.dto.js';

const context = {
  PE_ID_SYSTEM: 7,
  PE_ID_LOJA: 3,
  PE_ID_DEPARTAMENTO: 0,
  PE_ID_USUARIO: 1,
};
const supplierFields = {
  PE_ID_CATEGORIA: 0,
  PE_ID_TIPO: 0,
  PE_FISIJURI: '',
  PE_FONE1: '',
  PE_FONE2: '',
  PE_WHATAPP1: '',
  PE_WHATAPP2: '',
  PE_CONTATO1: '',
  PE_CONTATO2: '',
  PE_SETOR1: '',
  PE_SETOR2: '',
  PE_EMAIL1: '',
  PE_EMAIL2: '',
  PE_RAZAO_SOCIAL: '',
  PE_CNPJ: '',
  PE_INSC_ESTADUAL: '',
  PE_INSC_MUNICIPAL: '',
  PE_NOME_FANTASIA: '',
  PE_DATA_CNPJ: '',
  PE_NOME_RESPONSAVEL: '',
  PE_CARGO_RESPOSNAVEL: '',
  PE_ATIVIDADE_PRINCIPAL: '',
  PE_ATIVIDADES_SECUNDARIA1: '',
  PE_ATIVIDADES_SECUNDARIA2: '',
  PE_ATIVIDADES_SECUNDARIA3: '',
  PE_ATIVIDADES_SECUNDARIA4: '',
  PE_ATIVIDADES_SECUNDARIA5: '',
  PE_NATUREZA_JURIDICA: '',
  PE_OBJETIVO_MISSAO: '',
  PE_MISSAO_VISAO: '',
  PE_PRIMEIRO_NOME: '',
  PE_CARGO: '',
  PE_CPF: '',
  PE_RG: '',
  PE_GENERO: '',
  PE_SOBRENOME: '',
  PE_NOME_DO_MEIO: '',
  PE_TRATAMENTO: '',
  PE_TRABALHANAEMPRESA: '',
  PE_FORMACAOACADEMICA: '',
  PE_FORMACAOATUAL: '',
  PE_ESPECIALIZACAO: '',
  PE_INSTITUICAODEENSINO: '',
  PE_CONJUGUE: '',
  PE_DATADONASCIMENTO: '',
  PE_CEP: '',
  PE_ENDERECO: '',
  PE_ENDERECO_NUMERO: '',
  PE_COMPLEMENTO: '',
  PE_BAIRRO: '',
  PE_CIDADE: '',
  PE_UF: '',
  PE_REGIAO_PAIS: '',
  PE_PAIS: '',
  PE_COD_MUNICIPIO: 0,
  PE_COD_UF: 0,
  PE_WEBSITE: '',
  PE_SKYPE: '',
  PE_FACEBOOK: '',
  PE_TWITTER: '',
  PE_ANOTACOES: '',
  PE_NOME: 'Supplier',
} satisfies Omit<FornecedorCreateDto, keyof BaseRequestDto>;

const cases = [
  [FornecedorCreateDto, supplierFields],
  [FornecedorUpdateDto, { ...supplierFields, PE_ID_FORNECEDOR: 42 }],
  [FornecedorDeleteDto, { PE_ID_FORNECEDOR: 42 }],
  [FornecedorFindAllDto, { PE_FORNECEDOR: 'Supplier' }],
  [
    FornecedorProductFindIdDto,
    {
      PE_ID_PRODUTO: 0,
      PE_ID_FORNECEDOR: 0,
      PE_PRODUTO_DESCRICAO: '',
      PE_COD_PRODUTO_FORN: '',
    },
  ],
] as const;
const options = { whitelist: true, forbidNonWhitelisted: true };

describe('supplier request validation', () => {
  for (const [Dto, fields] of cases) {
    for (const field of Object.keys({ ...context, ...fields })) {
      for (const value of [undefined, null]) {
        it(`${Dto.name} rejects ${field} when ${String(value)}`, () => {
          const payload: Record<string, unknown> = { ...context, ...fields };
          if (value === undefined) delete payload[field];
          else payload[field] = value;
          const errors = validateSync(
            Object.assign(new Dto(), payload),
            options,
          );
          expect(errors.map((error) => error.property)).toContain(field);
        });
      }
    }
    it(`${Dto.name} validates inherited context and operation fields`, () => {
      const dto = Object.assign(new Dto(), context, fields);
      expect(dto).toBeInstanceOf(BaseRequestDto);
      expect(validateSync(dto, options)).toEqual([]);
      expect(
        validateSync(Object.assign(new Dto(), fields), options).map(
          (error) => error.property,
        ),
      ).toEqual(expect.arrayContaining(Object.keys(context)));
      expect(
        validateSync(
          Object.assign(new Dto(), context, fields, {
            PE_ID_USUARIO: 'invalid',
          }),
          options,
        ).map((error) => error.property),
      ).toContain('PE_ID_USUARIO');
      expect(
        validateSync(
          Object.assign(new Dto(), context, fields, { peIdSystem: 9 }),
          options,
        ).map((error) => error.property),
      ).toContain('peIdSystem');
    });
  }

  it('preserves the legacy tenant minimum and create name validation', () => {
    const dto = Object.assign(new FornecedorCreateDto(), context, {
      PE_ID_SYSTEM: 0,
      PE_NOME: 'abc',
    });
    expect(validateSync(dto, options).map((error) => error.property)).toEqual(
      expect.arrayContaining(['PE_ID_SYSTEM', 'PE_NOME']),
    );
  });

  it('rejects the legacy passkey body field, which is header-only', () => {
    const dto = Object.assign(new FornecedorDeleteDto(), context, {
      PE_PASSKEY: 'test-passkey',
      PE_ID_FORNECEDOR: 42,
    });
    expect(validateSync(dto, options).map((error) => error.property)).toEqual([
      'PE_PASSKEY',
    ]);
  });
});
