import { DeleteResult, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationQuery } from '../app/pagination/pagination-input.dto';
import { ArticleDB } from '../db/entities/articleDB.entity';
import { paginationTransform } from '../db/utils/pagination-transform';
import { User } from '../users/entities/user.entity';
import { Article } from './entities/article.entity';
import { IArticleRepository } from './interfaces/article-repository.interface';
import { IArticlesPagination } from './interfaces/articles-pagination.interface';

@Injectable()
export class ArticleRepository implements IArticleRepository {
  constructor(
    @InjectRepository(ArticleDB)
    private readonly articleRepository: Repository<ArticleDB>,
  ) {}

  async save(article: Article): Promise<Article> {
    try {
      const savedArticle = await this.articleRepository.save(
        this.toPersistence(article),
      );
      const foundArticle = await this.findById(savedArticle.id);
      if (!foundArticle) {
        throw new Error('Save but not find article');
      }
      return foundArticle;
    } catch (error) {
      throw new Error(`Failed to save article: ${error}`);
    }
  }

  async findById(id: string): Promise<Article | null> {
    try {
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: {
          author: true,
        },
      });
      return article ? this.toDomain(article) : null;
    } catch (error) {
      throw new Error(`Failed to find article by id: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result: DeleteResult = await this.articleRepository.delete(id);
      return !!result.affected;
    } catch (error) {
      throw new Error(`Failed to delete article: ${error}`);
    }
  }

  async findWithPagination(
    query: PaginationQuery,
  ): Promise<IArticlesPagination> {
    try {
      const [articles, totalCount]: [Array<ArticleDB>, number] =
        await this.articleRepository.findAndCount({
          where: paginationTransform.where(query),
          relations: {
            author: true,
          },
          order: paginationTransform.order(query.sortBy, query.sortDirection),
          skip: query.skip(),
          take: query.pageSize,
        });

      const pagesCount = query.countPages(totalCount);
      const articlesDomain: Article[] = articles.map((a) => this.toDomain(a));

      const result: IArticlesPagination = {
        pagesCount,
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: articlesDomain,
      };
      return result;
    } catch (error) {
      throw new Error(`Failed to find articles with pagination: ${error}`);
    }
  }

  private toDomain(entity: ArticleDB): Article {
    return new Article({ ...entity, author: new User({ ...entity.author }) });
  }

  private toPersistence(domain: Article) {
    return { ...domain, authorId: domain.author.id };
  }
}
