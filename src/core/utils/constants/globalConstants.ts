export const API_VERSION = 'v1';
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Constantes relacionadas a autenticação
export const JWT_EXPIRES_IN = '24h';
export const PASSWORD_MIN_LENGTH = 8;

// Constantes para códigos de resposta
export const RESPONSE_CODES = {
  SUCCESS: 100200,
  PROCESSED_SUCCESS: 100201,
  NO_CONTENT_FOUND: 100200, // Busca válida mas sem resultados
  NOT_FOUND: 100404,
  VALIDATION_ERROR: 100400,
  INTERNAL_ERROR: 100500,
  UNAUTHORIZED: 100401,
  FORBIDDEN: 100403,
  CONFLICT: 100409,
  UNPROCESSABLE_ENTITY: 100422,
  TOO_MANY_REQUESTS: 100429,
  REQUEST_TIMEOUT: 100408,
  GONE: 100410,
  PRECONDITION_FAILED: 100412,
  PROCESSING_FAILED: 100422, // Não foi possível processar as informações
};

// Constantes para mensagens de feedback
export const MESSAGES = {
  USER_CREATED: 'Usuário criado com sucesso',
  USER_UPDATED: 'Usuário atualizado com sucesso',
  USER_DELETED: 'Usuário excluído com sucesso',
  USER_NOT_FOUND: 'Usuário não encontrado',
  SEARCH_NO_RESULTS:
    'Busca realizada com sucesso, mas nenhum resultado foi encontrado',
  RESOURCE_NOT_FOUND: 'Recurso não encontrado', // Para 404 real
  PROCESSING_SUCCESS: 'Informações processadas com sucesso',
  PROCESSING_FAILURE: 'Não foi possível processar as informações',
  INVALID_TOKEN: 'Token inválido',
  TOKEN_EXPIRED: 'Token expirado',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  PASSWORD_RESET_SUCCESS: 'Senha redefinida com sucesso',
  UNKNOWN_ERROR: 'Ocorreu um erro desconhecido',
  PASSWORD_REQUIREMENTS: 'Use número, letras maiúscula e minuscula',
};
