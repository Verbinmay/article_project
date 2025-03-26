/* eslint-disable @typescript-eslint/unbound-method */
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  RegistrationCase,
  RegistrationCommand,
} from '../use-cases/registration-case';

import { TEST_FABRIC } from '../../../test/utils/fabric';
import { generateResponse } from '../../app/utils/generate-response';
import { User } from '../../users/entities/user.entity';
import { UsersRepository } from '../../users/users.repository';
import { AuthService } from '../auth.service';
import { RegistrationInputDto } from '../dto/registration-input.dto';

describe('RegistrationCase', () => {
  let registrationCase: RegistrationCase;
  let userRepository: UsersRepository;
  let authService: AuthService;
  let inputModel: RegistrationInputDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationCase,
        {
          provide: UsersRepository,
          useValue: {
            isLoginTaken: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    registrationCase = module.get<RegistrationCase>(RegistrationCase);
    userRepository = module.get<UsersRepository>(UsersRepository);
    authService = module.get<AuthService>(AuthService);
    inputModel = TEST_FABRIC.createRegistrationInput();
  });

  it('should register a new user successfully', async () => {
    const command = new RegistrationCommand(inputModel);

    const user = User.create({
      ...inputModel,
      hash: 'hashedPassword',
    });
    jest.spyOn(authService, 'hashPassword').mockResolvedValue('hashedPassword');
    jest.spyOn(userRepository, 'isLoginTaken').mockResolvedValue(false);
    jest.spyOn(userRepository, 'save').mockResolvedValue(user);

    const result = await registrationCase.execute(command);

    expect(result).toEqual(generateResponse(1));
    expect(authService.hashPassword).toHaveBeenCalledWith(inputModel.password);
    expect(userRepository.isLoginTaken).toHaveBeenCalledWith(inputModel.login);
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('should return an error if login is already taken', async () => {
    const command = new RegistrationCommand(inputModel);

    jest.spyOn(authService, 'hashPassword').mockResolvedValue('hashedPassword');
    jest.spyOn(userRepository, 'isLoginTaken').mockResolvedValue(true);

    const result = await registrationCase.execute(command);

    expect(result).toEqual(
      generateResponse(0, `Login ${inputModel.login} is already registered`),
    );
    expect(authService.hashPassword).toHaveBeenCalledWith(inputModel.password);
    expect(userRepository.isLoginTaken).toHaveBeenCalledWith(inputModel.login);
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should handle errors and log them', async () => {
    const command = new RegistrationCommand(inputModel);
    const error = new Error('Test error');

    jest.spyOn(authService, 'hashPassword').mockRejectedValue(error);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    const result = await registrationCase.execute(command);

    expect(result).toEqual(generateResponse(0, 'Registration failed'));
    expect(Logger.prototype.error).toHaveBeenCalledWith(error);
  });
});
