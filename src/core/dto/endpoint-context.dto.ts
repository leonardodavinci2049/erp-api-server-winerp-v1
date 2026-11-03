import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EndpointContextDto {
  @IsNumber({}, { message: 'App ID deve ser um número.' })
  @IsNotEmpty({ message: 'App ID é obrigatório.' })
  pe_app_id!: number;

  @IsNumber({}, { message: 'System Client ID deve ser um número.' })
  @IsNotEmpty({ message: 'System Client ID é obrigatório.' })
  pe_system_client_id!: number;

  @IsNumber({}, { message: 'Store ID deve ser um número.' })
  @IsNotEmpty({ message: 'Store ID é obrigatório.' })
  pe_store_id!: number;

  @IsString({ message: 'Organization ID deve ser um texto.' })
  @IsNotEmpty({ message: 'Organization ID é obrigatório.' })
  pe_organization_id!: string;

  @IsString({ message: 'User ID deve ser um texto.' })
  @IsNotEmpty({ message: 'User ID é obrigatório.' })
  pe_user_id!: string;

  @IsString({ message: 'User Name deve ser um texto.' })
  @IsNotEmpty({ message: 'User Name é obrigatório.' })
  pe_user_name!: string;

  @IsString({ message: 'User Role deve ser um texto.' })
  @IsNotEmpty({ message: 'User Role é obrigatório.' })
  pe_user_role!: string;

  @IsOptional()
  @IsNumber({}, { message: 'Person ID deve ser um número.' })
  pe_person_id?: number;
}
