import * as argon2 from 'argon2';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { APP_SETTINGS } from '../app/settings/app-settings';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import { AccessTokenPayload } from './dto/access-token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findByLogin(login);
    if (user && (await this.verifyPassword(user.hash, password))) {
      return user;
    }
    return null;
  }
  /**Чтобы предотвратить расхождение времени с сервером, прописываю вручную */
  async createJWTAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwt.signAsync(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor((Date.now() + 1 * 60 * 60 * 1000) / 1000), // 1 час
      },
      {
        secret: this.configService.get(APP_SETTINGS.ARTICLE_JWT_SECRET),
        // expiresIn: '24h',
      },
    );
  }
}
