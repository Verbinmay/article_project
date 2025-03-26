import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AccessTokenPayload } from '../../auth/dto/access-token-payload.dto';

export const PayloadCurrent = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AccessTokenPayload }>();
    const userId = request?.user?.login;
    if (typeof userId === 'undefined') {
      throw new Error('User not found');
    }
    return request.user;
  },
);
