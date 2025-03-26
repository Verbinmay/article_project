import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { generateResponse } from '../../app/utils/generate-response';
import { User } from '../../users/entities/user.entity';
import { UsersRepository } from '../../users/users.repository';
import { AuthService } from '../auth.service';
import { RegistrationInputDto } from '../dto/registration-input.dto';

export class RegistrationCommand {
  constructor(public inputModel: RegistrationInputDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationCase implements ICommandHandler<RegistrationCommand> {
  private readonly logger = new Logger(RegistrationCase.name);

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: RegistrationCommand) {
    try {
      const { login, password, firstName, lastName } = command.inputModel;

      if (!login || !password || !firstName || !lastName) {
        return generateResponse(0, 'Registration failed');
      }

      const hash = await this.authService.hashPassword(password);

      const user: User = User.create({
        firstName,
        lastName,
        login,
        hash,
      });

      const loginExists = await this.userRepository.isLoginTaken(user.login);
      if (loginExists) {
        return generateResponse(0, `Login ${user.login} is already registered`);
      }
      await this.userRepository.save(user);
      return generateResponse(1);
    } catch (error) {
      this.logger.error(error);
      //!Лучше делать запись в документ и высылать в корзину ошибок
      return generateResponse(0, 'Registration failed');
    }
  }
}
