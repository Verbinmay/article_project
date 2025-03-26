import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleDB } from '../db/entities/articleDB.entity';
import { RedisDBModule } from '../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { ArticleController } from './article.controller';
import { ArticleRepository } from './article.repository';
import { CreateArticleCase } from './use-cases/create-article-case';
import { DeleteArticleCase } from './use-cases/delete-article-case';
import { GetArticleCase } from './use-cases/get-article-case';
import { UpdateArticleCase } from './use-cases/update-article-case';

const cases = [
  CreateArticleCase,
  DeleteArticleCase,
  UpdateArticleCase,
  GetArticleCase,
];
@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleDB]),
    UsersModule,
    CqrsModule,
    RedisDBModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleRepository, ...cases],
})
export class ArticleModule {}
