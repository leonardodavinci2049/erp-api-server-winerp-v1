import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
// o tipo RoleEnum[] é um enum que contém os valores 'ADMIN' e 'USER'
// o Role[] é um array de roles que será passado para o decorator
// ..roles terá valor 'ADMIN' e 'USER' e será passado para o decorator
// o método SetMetadata é um método do NestJS que define metadados para um controlador ou um manipulador de método

/* 
O Nest oferece a capacidade de anexar dados personalizados a manipuladores de rotas por meio de arquivos @SetMetadata.
 É uma maneira de definir e armazenar dados declarativamente sobre seu controlador (endpoint).
  */
