import {
  randFirstName,
  randJobTitle,
  randLastName,
  randSentence,
  randUserName,
} from '@ngneat/falso';
import * as argon2 from 'argon2';

import { BUSINESS_SETTINGS } from '../../src/app/settings/business-settings';
import { NewArticleInputDto } from '../../src/article/dto/create-article-input.dto';
import { Article } from '../../src/article/entities/article.entity';
import { AccessTokenPayload } from '../../src/auth/dto/access-token-payload.dto';
import { RegistrationInputDto } from '../../src/auth/dto/registration-input.dto';
import { User } from '../../src/users/entities/user.entity';

export const TEST_FABRIC = {
  createRegistrationInput(): RegistrationInputDto {
    return {
      firstName: randFirstName().slice(
        0,
        BUSINESS_SETTINGS.user.firstName.maxLength,
      ),
      lastName: randLastName().slice(
        0,
        BUSINESS_SETTINGS.user.lastName.maxLength,
      ),
      login: randUserName().slice(0, BUSINESS_SETTINGS.user.login.maxLength),
      password: 'password123!',
    };
  },

  async createUserClass(): Promise<User> {
    const user: RegistrationInputDto = TEST_FABRIC.createRegistrationInput();
    const hash = await argon2.hash(user.password);
    return User.create({
      ...user,
      hash,
    });
  },

  createArticleInput(): NewArticleInputDto {
    return {
      title: randJobTitle().slice(0, BUSINESS_SETTINGS.article.title.maxLength),
      text: randSentence().slice(0, BUSINESS_SETTINGS.article.text.maxLength),
    };
  },

  async createArticle(author?: User): Promise<Article> {
    const article: NewArticleInputDto = TEST_FABRIC.createArticleInput();
    if (!author) {
      author = await TEST_FABRIC.createUserClass();
    }
    return Article.create({
      ...article,
      author,
    });
  },

  async createAccessTokenPayload(user?: User): Promise<AccessTokenPayload> {
    if (!user) {
      user = await TEST_FABRIC.createUserClass();
    }
    return {
      login: user.login,
      userId: user.id,
    };
  },
};
