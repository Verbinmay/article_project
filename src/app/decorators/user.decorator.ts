import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../../users/entities/user.entity';

export const UserCurrent = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    const userId = request?.user?.id;
    if (typeof userId === 'undefined') {
      throw new Error('User not found');
    }
    return request.user;
  },
);
