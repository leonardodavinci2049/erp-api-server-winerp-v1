import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { envs } from '../config/envs.js';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Define interface para a requisição
    interface RequestWithAuth {
      headers: {
        authorization?: string;
        'x-api-key'?: string;
      };
      apiKey?: string; // Adiciona propriedade para armazenar a API key
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();

    // Verifica se a API key foi fornecida no header Authorization ou x-api-key
    let apiKey: string | undefined;

    // Tenta pegar a API key do header Authorization (formato: "Bearer API_KEY")
    const authHeader: string | undefined = request.headers.authorization;
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        apiKey = parts[1];
      }
    }

    // Se não encontrou no Authorization, tenta no x-api-key
    if (!apiKey) {
      apiKey = request.headers['x-api-key'];
    }

    // Se não forneceu a API key
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Verifica se a API key é válida
    if (apiKey !== envs.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Armazena a API key no request para uso posterior
    request.apiKey = apiKey;

    return true;
  }
}
