import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { generateResponse } from '../../app/utils/generate-response';
import { AccessTokenPayload } from '../../auth/dto/access-token-payload.dto';
import { User } from '../../users/entities/user.entity';
import { UsersRepository } from '../../users/users.repository';
import { ArticleRepository } from '../article.repository';
import { NewArticleInputDto } from '../dto/create-article-input.dto';
import { Article } from '../entities/article.entity';

export class CreateArticleCommand {
  constructor(
    public inputModel: NewArticleInputDto,
    public userPayload: AccessTokenPayload,
  ) {}
}

@CommandHandler(CreateArticleCommand)
export class CreateArticleCase
  implements ICommandHandler<CreateArticleCommand>
{
  private readonly logger = new Logger(CreateArticleCase.name);

  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateArticleCommand) {
    try {
      const { title, text } = command.inputModel;
      const { login, userId } = command.userPayload;

      if (!title || !text || !login || !userId) {
        return generateResponse(0, 'Create article failed');
      }

      const user: User | null = await this.usersRepository.findByLogin(login);
      if (!user) {
        return generateResponse(0, 'User not found');
      }

      const article: Article = Article.create({
        title,
        text,
        author: user,
      });

      const savedArticle = await this.articleRepository.save(article);

      return generateResponse(1, '', savedArticle.toPublicEntity());
    } catch (error) {
      this.logger.error(error);
      //!Лучше делать запись в документ и высылать в корзину ошибок
      return generateResponse(0, 'Registration failed');
    }
  }
}
