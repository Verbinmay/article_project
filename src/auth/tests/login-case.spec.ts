/* eslint-disable @typescript-eslint/unbound-method */

import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TEST_FABRIC } from '../../../test/utils/fabric';
import { generateResponse } from '../../app/utils/generate-response';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';
import { LoginCase, LoginCommand } from '../use-cases/login-case';

describe('LoginCase', () => {
  let loginCase: LoginCase;
  let authService: AuthService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginCase,
        {
          provide: AuthService,
          useValue: {
            createJWTAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    loginCase = module.get<LoginCase>(LoginCase);
    authService = module.get<AuthService>(AuthService);
    user = await TEST_FABRIC.createUserClass();
  });

  it('should return error response if login is empty', async () => {
    user.login = '';
    const command = new LoginCommand(user);
    const result = await loginCase.execute(command);

    expect(result).toEqual(generateResponse(0, 'Login or id is empty'));
  });
  it('should return error response if id is empty', async () => {
    user.id = '';
    const command = new LoginCommand(user);
    const result = await loginCase.execute(command);

    expect(result).toEqual(generateResponse(0, 'Login or id is empty'));
  });

  it('should return access token if login and id are provided', async () => {
    const command = new LoginCommand(user);
    const accessToken = 'testAccessToken';
    jest
      .spyOn(authService, 'createJWTAccessToken')
      .mockResolvedValue(accessToken);

    const result = await loginCase.execute(command);

    expect(result).toEqual(generateResponse(1, '', { accessToken }));
    expect(authService.createJWTAccessToken).toHaveBeenCalledWith({
      login: user.login,
      userId: user.id,
    });
  });

  it('should log error and return registration failed response on exception', async () => {
    const command = new LoginCommand(user);
    const error = new Error('Test error');
    jest.spyOn(authService, 'createJWTAccessToken').mockRejectedValue(error);
    const loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation();

    const result = await loginCase.execute(command);

    expect(result).toEqual(generateResponse(0, 'Registration failed'));
    expect(loggerErrorSpy).toHaveBeenCalledWith(error);
  });
});
