/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { randUuid } from '@ngneat/falso';
import {
  UpdateArticleCase,
  UpdateArticleCommand,
} from '../use-cases/update-article-case';

import { TEST_FABRIC } from '../../../test/utils/fabric';
import { BUSINESS_SETTINGS } from '../../app/settings/business-settings';
import { generateResponse } from '../../app/utils/generate-response';
import { AccessTokenPayload } from '../../auth/dto/access-token-payload.dto';
import { RedisDBService } from '../../redis/redis.service';
import { User } from '../../users/entities/user.entity';
import { ArticleRepository } from '../article.repository';
import { UpdateArticleInputDto } from '../dto/update-article-input.dto';
import { Article } from '../entities/article.entity';

describe('UpdateArticleCase', () => {
  let updateArticleCase: UpdateArticleCase;
  let articleRepository: jest.Mocked<ArticleRepository>;
  let redisDBService: jest.Mocked<RedisDBService>;
  let articleInput: UpdateArticleInputDto;
  let user: User;
  let article: Article;
  let accessTokenPayload: AccessTokenPayload;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateArticleCase,
        {
          provide: ArticleRepository,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: RedisDBService,
          useValue: {
            deleteKeysByPattern: jest.fn(),
          },
        },
      ],
    }).compile();

    updateArticleCase = module.get<UpdateArticleCase>(UpdateArticleCase);
    articleRepository = module.get(ArticleRepository);
    redisDBService = module.get(RedisDBService);
    articleInput = TEST_FABRIC.createArticleInput();
    user = await TEST_FABRIC.createUserClass();
    article = await TEST_FABRIC.createArticle(user);
    accessTokenPayload = await TEST_FABRIC.createAccessTokenPayload(user);
  });

  it('should return failure response if required fields are missing', async () => {
    const command = new UpdateArticleCommand(
      '',
      {} as UpdateArticleInputDto,
      {} as AccessTokenPayload,
    );

    const result = await updateArticleCase.execute(command);

    expect(result).toEqual(generateResponse(0, 'Update article failed'));
  });

  it('should return failure response if article is not found', async () => {
    articleRepository.findById.mockResolvedValue(null);
    const command = new UpdateArticleCommand(
      article.id,
      articleInput,
      accessTokenPayload,
    );

    const result = await updateArticleCase.execute(command);

    expect(result).toEqual(generateResponse(0, 'Article not found'));
    expect(articleRepository.findById).toHaveBeenCalledWith(article.id);
  });

  it('should return failure response if user is not the author', async () => {
    article.author.id = randUuid();
    articleRepository.findById.mockResolvedValue(article);
    const command = new UpdateArticleCommand(
      article.id,
      articleInput,
      accessTokenPayload,
    );

    const result = await updateArticleCase.execute(command);

    expect(result).toEqual(
      generateResponse(0, 'You are not the author of this article'),
    );
  });

  it('should update the article and return success response', async () => {
    articleRepository.findById.mockResolvedValue(article);

    articleRepository.save.mockResolvedValue({
      ...article,
      ...articleInput,
    } as Article);
    const command = new UpdateArticleCommand(
      article.id,
      articleInput,
      accessTokenPayload,
    );

    const result = await updateArticleCase.execute(command);

    expect(result).toEqual(
      generateResponse(1, '', {
        ...article,
        ...articleInput,
      } as Article),
    );
    expect(articleRepository.save).toHaveBeenCalledWith({
      ...article,
      ...articleInput,
    } as Article);
    expect(redisDBService.deleteKeysByPattern).toHaveBeenCalledWith(
      `${BUSINESS_SETTINGS.redis.articleListPrefix}*`,
    );
  });

  it('should log error and return failure response on exception', async () => {
    jest
      .spyOn(updateArticleCase['logger'], 'error')
      .mockImplementation(() => {});
    articleRepository.findById.mockRejectedValue(new Error('Database error'));
    const command = new UpdateArticleCommand(
      article.id,
      articleInput,
      accessTokenPayload,
    );

    const result = await updateArticleCase.execute(command);

    expect(result).toEqual(generateResponse(0, 'Update article failed'));
    expect(updateArticleCase['logger'].error).toHaveBeenCalled();
  });
});
