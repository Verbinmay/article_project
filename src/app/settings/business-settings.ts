export enum SortingOptions {
  date = 'date',
  authorfirstname = 'authorfirstname',
  authorlastname = 'authorlastname',
  title = 'title',
}
export enum SortDirections {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const BUSINESS_SETTINGS = {
  user: {
    login: {
      minLength: 4,
      maxLength: 10,
    },
    firstName: {
      maxLength: 30,
      minLength: 1,
    },
    lastName: {
      maxLength: 30,
      minLength: 1,
    },
    password: {
      minLength: 8,
      maxLength: 30,
      regex:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    },
  },
  article: {
    title: {
      maxLength: 100,
      minLength: 1,
    },
    text: {
      maxLength: 1000,
      minLength: 1,
    },
  },
  pagination: {
    default: {
      pageNumber: 1,
      pageSize: 10,
      sortBy: SortingOptions.title,
      sortDirection: SortDirections.DESC,
    },
    options: {
      sorting: SortingOptions,
      directions: SortDirections,
    },
  },
  redis: {
    articleListPrefix: 'articles:list:',
  },
};
