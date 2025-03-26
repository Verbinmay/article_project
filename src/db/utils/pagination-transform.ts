import { ILike, MoreThan } from 'typeorm';
import {
  SortDirections,
  SortingOptions,
} from '../../app/settings/business-settings';

import { PaginationQuery } from '../../app/pagination/pagination-input.dto';

export const paginationTransform = {
  order(value: SortingOptions, direction: SortDirections) {
    switch (value) {
      case SortingOptions.title:
        return {
          title: direction,
        };
      case SortingOptions.authorfirstname:
        return {
          author: {
            firstName: direction,
          },
        };
      case SortingOptions.authorlastname:
        return {
          author: {
            lastName: direction,
          },
        };
      case SortingOptions.date:
        return {
          date: direction,
        };
      default:
        return {};
    }
  },
  where(query: PaginationQuery) {
    const where = {};
    if (query.titleSearchTerm !== '') {
      where['title'] = ILike('%' + query.titleSearchTerm + '%');
    }
    if (query.searchAuthorFirstNameTerm !== '') {
      where['author'] = {
        firstName: ILike('%' + query.searchAuthorFirstNameTerm + '%'),
      };
    }
    if (query.searchAuthorLastNameTerm !== '') {
      where['author'] = {
        lastName: ILike('%' + query.searchAuthorLastNameTerm + '%'),
      };
    }
    if (query.searchDate) {
      where['date'] = MoreThan(query.searchDate);
    }
    return where;
  },
};
