import { PaginationQuery } from '../../app/pagination/pagination-input.dto';
import { Article } from '../entities/article.entity';
import { IArticlesPagination } from './articles-pagination.interface';

export interface IArticleRepository {
  save(article: Article): Promise<Article>;
  findById(id: string): Promise<Article | null>;
  delete(id: string): Promise<boolean>;
  findWithPagination(query: PaginationQuery): Promise<IArticlesPagination>;
}
