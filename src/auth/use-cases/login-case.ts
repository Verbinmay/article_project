import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { generateResponse } from '../../app/utils/generate-response';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';

export class LoginCommand {
  constructor(public inputModel: User) {}
}

@CommandHandler(LoginCommand)
export class LoginCase implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginCase.name);

  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand) {
    try {
      const user: User = command.inputModel;
      if (!user.login || !user.id) {
        return generateResponse(0, 'Login or id is empty');
      }
      const accessToken = await this.authService.createJWTAccessToken({
        login: user.login,
        userId: user.id,
      });
      return generateResponse(1, '', { accessToken });
    } catch (error) {
      this.logger.error(error);
      //!Лучше делать запись в документ и высылать в корзину ошибок
      return generateResponse(0, 'Registration failed');
    }
  }
}
