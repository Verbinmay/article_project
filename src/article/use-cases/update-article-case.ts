import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BUSINESS_SETTINGS } from '../../app/settings/business-settings';
import { generateResponse } from '../../app/utils/generate-response';
import { AccessTokenPayload } from '../../auth/dto/access-token-payload.dto';
import { RedisDBService } from '../../redis/redis.service';
import { ArticleRepository } from '../article.repository';
import { UpdateArticleInputDto } from '../dto/update-article-input.dto';

export class UpdateArticleCommand {
  constructor(
    public id: string,
    public inputModel: UpdateArticleInputDto,
    public userPayload: AccessTokenPayload,
  ) {}
}

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleCase
  implements ICommandHandler<UpdateArticleCommand>
{
  private readonly logger = new Logger(UpdateArticleCase.name);

  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly redisDBService: RedisDBService,
  ) {}

  async execute(command: UpdateArticleCommand) {
    try {
      const id = command.id;
      const { title, text } = command.inputModel;
      const { login, userId } = command.userPayload;

      if (!title || !text || !id || !login || !userId) {
        return generateResponse(0, 'Update article failed');
      }

      const article = await this.articleRepository.findById(id);
      if (!article) {
        return generateResponse(0, 'Article not found');
      }

      if (article.author.id !== userId) {
        return generateResponse(0, 'You are not the author of this article');
      }

      article.title = title;
      article.text = text;

      const savedArticle = await this.articleRepository.save(article);

      await this.redisDBService.deleteKeysByPattern(
        `${BUSINESS_SETTINGS.redis.articleListPrefix}*`,
      );

      return generateResponse(1, '', savedArticle);
    } catch (error) {
      this.logger.error(error);
      //!Лучше делать запись в документ и высылать в корзину ошибок
      return generateResponse(0, 'Update article failed');
    }
  }
}
