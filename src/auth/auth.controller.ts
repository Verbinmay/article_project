import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CommandBus } from '@nestjs/cqrs';

import { UserCurrent } from '../app/decorators/user.decorator';
import { ResponseType } from '../app/utils/generate-response';
import { User } from '../users/entities/user.entity';
import { RegistrationInputDto } from './dto/registration-input.dto';
import { LocalAuthGuard } from './passport/guards/local-auth.guard';
import { LoginCommand } from './use-cases/login-case';
import { RegistrationCommand } from './use-cases/registration-case';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('registration')
  @HttpCode(201)
  async registration(@Body() inputModel: RegistrationInputDto) {
    const result: ResponseType = await this.commandBus.execute(
      new RegistrationCommand(inputModel),
    );
    return { success: result.success };
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @UserCurrent() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: ResponseType<{ accessToken: string }> =
      await this.commandBus.execute(new LoginCommand(user));

    if (!result.success) {
      return { success: false };
    }

    res.cookie('accessToken', result.data!.accessToken, {
      httpOnly: true,
      secure: true,
    });
    return { success: true };
  }
}
