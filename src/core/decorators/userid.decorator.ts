import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

export const UserIdDecorator = createParamDecorator(
  (_filter: string, context: ExecutionContext) => {
    // console.log('UserIdDecorator filter: ' + JSON.stringify(filter));
    interface RequestWithTokenPayload extends Request {
      tokenPayload?: { id?: string };
    }

    const request = context
      .switchToHttp()
      .getRequest<RequestWithTokenPayload>();

    /*     console.log(
      'tokenPayload: ' + JSON.stringify({ userID: request.tokenPayload }),
    );
 */
    if (request.tokenPayload?.id) {
      const userId = parseInt(request.tokenPayload.id, 10); //

      return { id: userId };
    } else {
      throw new NotFoundException(
        'Usuário não encontrado no Request. Use o AuthGuard para obter o usuário.',
      );
    }
  },
);
