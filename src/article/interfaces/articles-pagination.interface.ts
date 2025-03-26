import { IBasePagination } from '../../app/pagination/pagination.interface';
import { Article } from '../entities/article.entity';

export interface IArticlesPagination extends IBasePagination {
  items: Article[];
}
