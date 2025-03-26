import {
  BadRequestException,
  ConflictException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { RegistrationInputDto } from '../../auth/dto/registration-input.dto';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class RepeatingLoginValidationPipe implements PipeTransform {
  constructor(private readonly userRepository: UsersRepository) {}

  async transform(value: RegistrationInputDto) {
    try {
      const isLoginTaken = await this.userRepository.isLoginTaken(value.login);

      if (isLoginTaken) {
        throw new BadRequestException(
          `Login ${value.login} is already registered`,
        );
      }

      return value;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      //! Что-то получше придумать
      console.error(error);
      throw new ConflictException('Login validation failed');
    }
  }
}
