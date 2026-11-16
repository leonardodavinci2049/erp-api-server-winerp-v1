import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BaseRequestDto {
  @IsString({ message: 'Passkey deve ser um texto.' })
  @IsNotEmpty({ message: 'Passkey é obrigatória.' })
  PE_PASSKEY!: string;

  @IsNumber({}, { message: 'ID do sistema deve ser um número.' })
  @IsNotEmpty({ message: 'ID do sistema é obrigatório.' })
  PE_ID_SYSTEM!: number;

  @IsNumber({}, { message: 'ID da loja deve ser um número.' })
  @IsNotEmpty({ message: 'ID da loja é obrigatório.' })
  PE_ID_LOJA!: number;

  @IsNumber({}, { message: 'ID do departamento deve ser um número.' })
  @IsNotEmpty({ message: 'ID do departamento é obrigatório.' })
  PE_ID_DEPARTAMENTO!: number;

  @IsString({ message: 'ID do usuário deve ser um texto.' })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório.' })
  PE_ID_USUARIO!: string;
}
