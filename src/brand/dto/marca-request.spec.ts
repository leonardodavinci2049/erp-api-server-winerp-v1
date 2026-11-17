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

const context = {
  PE_ID_SYSTEM: 1,
  PE_ID_LOJA: 1,
  PE_ID_DEPARTAMENTO: 0,
  PE_ID_USUARIO: 1,
};
const options = { whitelist: true, forbidNonWhitelisted: true };

describe('Marca request contracts', () => {
  it('accepts operation fields with the shared base context', async () => {
    const requests = [
      plainToInstance(MarcaFindAllDto, {
        ...context,
        PE_ID_MARCA: 0,
        PE_MARCA: '',
      }),
      plainToInstance(MarcaAddComboBoxDto, {
        ...context,
        PE_ID_MARCA: 0,
      }),
      plainToInstance(MarcaCreateDto, {
        ...context,
        PE_NOME: 'Marca',
        PE_PASTA_IMG: '',
        PE_ANOTACOES: '',
      }),
      plainToInstance(MarcaUpdateDto, {
        ...context,
        PE_ID_MARCA: 1,
        PE_NOME: '',
        PE_PATH_IMAGEM: '',
        PE_INATIVO: 0,
        PE_ANOTACOES: '',
      }),
      plainToInstance(MarcaDeleteDto, {
        ...context,
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
        'PE_ID_SYSTEM',
        'PE_ID_LOJA',
        'PE_ID_DEPARTAMENTO',
        'PE_ID_USUARIO',
      ]),
    );
  });

  it('rejects the legacy passkey body field, which is header-only', async () => {
    const dto = plainToInstance(MarcaDeleteDto, {
      ...context,
      PE_PASSKEY: 'example-passkey',
      PE_ID_MARCA: 1,
    });
    expect(
      (await validate(dto, options)).map((error) => error.property),
    ).toEqual(['PE_PASSKEY']);
  });

  it('inherits directly from BaseRequestDto in all five DTOs', () => {
    for (const dto of [
      MarcaFindAllDto,
      MarcaAddComboBoxDto,
      MarcaCreateDto,
      MarcaUpdateDto,
      MarcaDeleteDto,
    ]) {
      expect(Object.getPrototypeOf(dto.prototype)).toBe(
        BaseRequestDto.prototype,
      );
    }
  });

  it('validates numeric context for existing operations', async () => {
    const invalid = plainToInstance(MarcaDeleteDto, {
      ...context,
      PE_ID_USUARIO: 'invalid',
      PE_ID_MARCA: 1,
    });
    expect(
      (await validate(invalid, options)).map((error) => error.property),
    ).toEqual(expect.arrayContaining(['PE_ID_USUARIO']));
  });

  it('rejects nonpositive mutation ids and short creation names', async () => {
    expect(
      await validate(
        plainToInstance(MarcaDeleteDto, {
          ...context,
          PE_ID_MARCA: 0,
        }),
        options,
      ),
    ).not.toEqual([]);
    expect(
      await validate(
        plainToInstance(MarcaCreateDto, {
          ...context,
          PE_NOME: 'abc',
          PE_PASTA_IMG: '',
          PE_ANOTACOES: '',
        }),
        options,
      ),
    ).not.toEqual([]);
  });
});
