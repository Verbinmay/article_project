import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BUSINESS_SETTINGS } from '../../app/settings/business-settings';
import { generateResponse } from '../../app/utils/generate-response';
import { RedisDBService } from '../../redis/redis.service';
import { ArticleRepository } from '../article.repository';

export class DeleteArticleCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleCase
  implements ICommandHandler<DeleteArticleCommand>
{
  private readonly logger = new Logger(DeleteArticleCase.name);

  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly redisDBService: RedisDBService,
  ) {}

  async execute(command: DeleteArticleCommand) {
    try {
      const id = command.id;

      if (!id) {
        return generateResponse(0, 'Delete article failed');
      }

      const isArticleDeleted: boolean = await this.articleRepository.delete(id);

      await this.redisDBService.deleteKeysByPattern(
        `${BUSINESS_SETTINGS.redis.articleListPrefix}*`,
      );

      return generateResponse(1, '', isArticleDeleted);
    } catch (error) {
      this.logger.error(error);
      //!Лучше делать запись в документ и высылать в корзину ошибок
      return generateResponse(0, 'Delete article failed');
    }
  }
}
