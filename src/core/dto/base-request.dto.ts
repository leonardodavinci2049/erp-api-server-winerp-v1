import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Shared context inherited by every business request DTO.
 * Authentication is sent through the request headers and validated by
 * `AuthGuard`; it is not part of the JSON body.
 */
export class BaseRequestDto {
  @IsNumber({}, { message: 'ID do sistema deve ser um número.' })
  @IsNotEmpty({ message: 'ID do sistema é obrigatório.' })
  PE_ID_SYSTEM!: number;

  @IsNumber({}, { message: 'ID da loja deve ser um número.' })
  @IsNotEmpty({ message: 'ID da loja é obrigatório.' })
  PE_ID_LOJA!: number;

  @IsNumber({}, { message: 'ID do departamento deve ser um número.' })
  @IsNotEmpty({ message: 'ID do departamento é obrigatório.' })
  PE_ID_DEPARTAMENTO!: number;

  @IsNumber({}, { message: 'ID do usuário deve ser um número.' })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório.' })
  PE_ID_USUARIO!: number;
}
