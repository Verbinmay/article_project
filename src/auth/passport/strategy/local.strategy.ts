import { Strategy } from 'passport-local';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '../../../users/entities/user.entity';
import { AuthService } from '../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string) {
    const user: User | null = await this.authService.validateUser(
      login.trim(),
      password,
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
