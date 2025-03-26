import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaginationQuery } from '../../app/pagination/pagination-input.dto';
import { BUSINESS_SETTINGS } from '../../app/settings/business-settings';
import { generateResponse } from '../../app/utils/generate-response';
import { RedisDBService } from '../../redis/redis.service';
import { ArticleRepository } from '../article.repository';
import { IArticlesPagination } from '../interfaces/articles-pagination.interface';
import { IArticlesPaginationOutput } from '../interfaces/articles-pagination-output.interface';

export class GetArticleCommand {
  constructor(public query: PaginationQuery) {}
}

@CommandHandler(GetArticleCommand)
export class GetArticleCase implements ICommandHandler<GetArticleCommand> {
  private readonly logger = new Logger(GetArticleCase.name);

  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly redisDBService: RedisDBService,
  ) {}

  async execute(command: GetArticleCommand) {
    try {
      const { pageNumber, pageSize, sortBy, sortDirection } = command.query;

      const cacheKey = `${BUSINESS_SETTINGS.redis.articleListPrefix}n:${pageNumber}:s:${pageSize}:sb:${sortBy}:sd:${sortDirection}`;

      const isEasy: boolean = command.query.hasNoSearchTerms();
      if (isEasy) {
        const cachedArticles = await this.redisDBService.get(cacheKey);
        if (typeof cachedArticles === 'string') {
          return JSON.parse(cachedArticles) as IArticlesPaginationOutput;
        }
      }
      const paginatorArticles: IArticlesPagination =
        await this.articleRepository.findWithPagination(command.query);

      const publicPaginatorArticles: IArticlesPaginationOutput = {
        ...paginatorArticles,
        items: paginatorArticles.items.map((article) =>
          article.toPublicEntity(),
        ),
      };

      const result = generateResponse(1, '', publicPaginatorArticles);
      await this.redisDBService.set(cacheKey, JSON.stringify(result), 3600);

      return result;
    } catch (error) {
      this.logger.error(error);
      //!Лучше делать запись в документ и высылать в корзину ошибок
      return generateResponse(0, 'Get articles with pagination failed');
    }
  }
}
