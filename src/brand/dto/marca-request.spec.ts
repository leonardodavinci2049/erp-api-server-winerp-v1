import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { MarcaFindAllDto } from './marca-find-all.dto.js';
import { MarcaAddComboBoxDto } from './marca-add-combo-box.dto.js';
import { MarcaCreateDto } from './marca-create.dto.js';
import { MarcaUpdateDto } from './marca-update.dto.js';
import { MarcaDeleteDto } from './marca-delete.dto.js';
import { BaseRequestDto } from '../../core/dto/base-request.dto.js';
import { BrandFindManagerIdV2Dto } from './brand-find-manager-id_v2.dto.js';
import { BrandFindSearchV2Dto } from './brand-find-search-v2.dto.js';
import { BrandUpdGeneralFieldDto } from './brand-upd-general-field.dto.js';

const context = {
  PE_ID_SYSTEM: 1,
  PE_ID_LOJA: 1,
  PE_ID_DEPARTAMENTO: 0,
  PE_ID_USUARIO: 'USER001',
};
const options = { whitelist: true, forbidNonWhitelisted: true };

describe('Marca request contracts', () => {
  it('accepts operation fields with the shared base context', async () => {
    const requests = [
      plainToInstance(MarcaFindAllDto, {
        ...context,
        PE_PASSKEY: 'example-passkey',
        PE_ID_MARCA: 0,
        PE_MARCA: '',
      }),
      plainToInstance(MarcaAddComboBoxDto, {
        ...context,
        PE_PASSKEY: 'example-passkey',
        PE_ID_MARCA: 0,
      }),
      plainToInstance(MarcaCreateDto, {
        ...context,
        PE_PASSKEY: 'example-passkey',
        PE_NOME: 'Marca',
        PE_PASTA_IMG: '',
        PE_ANOTACOES: '',
      }),
      plainToInstance(MarcaUpdateDto, {
        ...context,
        PE_PASSKEY: 'example-passkey',
        PE_ID_MARCA: 1,
        PE_NOME: '',
        PE_PATH_IMAGEM: '',
        PE_INATIVO: 0,
        PE_ANOTACOES: '',
      }),
      plainToInstance(MarcaDeleteDto, {
        ...context,
        PE_PASSKEY: 'example-passkey',
        PE_ID_MARCA: 1,
      }),
    ];
    for (const request of requests)
      expect(await validate(request, options)).toEqual([]);
  });

  it('rejects renamed keys, absent tenant and missing unused fields', async () => {
    const dto = plainToInstance(MarcaDeleteDto, {
      pePassKey: '',
      pePasseKey: '',
      PE_ID_MARCA: 1,
    });
    const fields = (await validate(dto, options)).map(
      (error) => error.property,
    );
    expect(fields).toEqual(
      expect.arrayContaining([
        'pePassKey',
        'pePasseKey',
        'PE_PASSKEY',
        'PE_ID_SYSTEM',
        'PE_ID_LOJA',
        'PE_ID_DEPARTAMENTO',
        'PE_ID_USUARIO',
      ]),
    );
  });

  it('inherits directly from BaseRequestDto in all eight DTOs', () => {
    for (const dto of [
      MarcaFindAllDto,
      MarcaAddComboBoxDto,
      MarcaCreateDto,
      MarcaUpdateDto,
      MarcaDeleteDto,
      BrandFindManagerIdV2Dto,
      BrandFindSearchV2Dto,
      BrandUpdGeneralFieldDto,
    ]) {
      expect(Object.getPrototypeOf(dto.prototype)).toBe(
        BaseRequestDto.prototype,
      );
    }
  });

  it('validates the additional context of existing operations', async () => {
    const base = {
      ...context,
      PE_PASSKEY: 'example-passkey',
      pe_app_id: 1,
      pe_organization_id: 'ORG001',
      pe_user_name: 'User',
      pe_user_role: 'admin',
    };
    const requests = [
      plainToInstance(BrandFindManagerIdV2Dto, { ...base, pe_brand_id: 1 }),
      plainToInstance(BrandFindSearchV2Dto, {
        ...base,
        pe_search: '',
        pe_inactive: 0,
        pe_limit: 10,
      }),
      plainToInstance(BrandUpdGeneralFieldDto, {
        ...base,
        pe_register_id: 1,
        pe_field_type: 1,
        pe_field: 'NOME',
        pe_value_str: 'Marca',
      }),
    ];
    for (const dto of requests)
      expect(await validate(dto, options)).toEqual([]);
    const invalid = plainToInstance(MarcaDeleteDto, {
      ...context,
      PE_PASSKEY: '',
      PE_ID_USUARIO: 1,
      PE_ID_MARCA: 1,
    });
    expect(
      (await validate(invalid, options)).map((error) => error.property),
    ).toEqual(expect.arrayContaining(['PE_PASSKEY', 'PE_ID_USUARIO']));
  });

  it('rejects nonpositive mutation ids and short creation names', async () => {
    expect(
      await validate(
        plainToInstance(MarcaDeleteDto, {
          ...context,
          PE_PASSKEY: 'example-passkey',
          PE_ID_MARCA: 0,
        }),
        options,
      ),
    ).not.toEqual([]);
    expect(
      await validate(
        plainToInstance(MarcaCreateDto, {
          ...context,
          PE_PASSKEY: 'example-passkey',
          PE_NOME: 'abc',
          PE_PASTA_IMG: '',
          PE_ANOTACOES: '',
        }),
        options,
      ),
    ).not.toEqual([]);
  });
});
