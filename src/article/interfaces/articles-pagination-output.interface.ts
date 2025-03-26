import { IBasePagination } from '../../app/pagination/pagination.interface';
import { IArticleOutput } from '../dto/article-output.interface';

export interface IArticlesPaginationOutput extends IBasePagination {
  items: IArticleOutput[];
}
