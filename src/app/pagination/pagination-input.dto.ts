/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BUSINESS_SETTINGS } from '../settings/business-settings';

const defaultPageNumber = BUSINESS_SETTINGS.pagination.default.pageNumber;
const defaultPageSize = BUSINESS_SETTINGS.pagination.default.pageSize;
const defaultSortingBy = BUSINESS_SETTINGS.pagination.default.sortBy;
const defaultSortDirection = BUSINESS_SETTINGS.pagination.default.sortDirection;

export class BasicPagination {
  @IsOptional()
  @Transform(({ value }) => containsOnlyOneNumber(value))
  pageNumber = defaultPageNumber;

  @IsOptional()
  @Transform(({ value }) => containsOnlyOneNumber(value))
  pageSize = defaultPageSize;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsEnum(BUSINESS_SETTINGS.pagination.options.sorting, {
    message: 'Sort filter not exist',
  })
  sortBy = defaultSortingBy;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(BUSINESS_SETTINGS.pagination.options.directions, {
    message: 'Sort direction must be asc or desc',
  })
  sortDirection = defaultSortDirection;

  public skip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
  public countPages(totalCount: number) {
    return Math.ceil(totalCount / this.pageSize);
  }
}

export class PaginationQuery extends BasicPagination {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => containsOnlyOneWord(value))
  searchAuthorFirstNameTerm = '';

  @IsString()
  @IsOptional()
  @Transform(({ value }) => containsOnlyOneWord(value))
  searchAuthorLastNameTerm = '';

  @IsString()
  @IsOptional()
  @Transform(({ value }) => normalizeTitleTerm(value))
  titleSearchTerm = '';

  @IsOptional()
  @Transform(({ value }) => parseDate(value))
  searchDate?: Date;

  public hasNoSearchTerms() {
    return (
      !this.searchAuthorFirstNameTerm &&
      !this.searchAuthorLastNameTerm &&
      !this.titleSearchTerm &&
      !this.searchDate
    );
  }
}

function containsOnlyOneNumber(value: any): number {
  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue > 0
    ? numericValue
    : BUSINESS_SETTINGS.pagination.default.pageNumber;
}

function normalizeTitleTerm(value?: string): string {
  if (!value) return '';
  return value
    .trim()
    .replace(/[^a-zа-яё0-9-]/giu, ' ')
    .substring(0, 100);
}

function parseDate(value: any): Date | undefined {
  try {
    return new Date(value);
  } catch {
    return undefined;
  }
}

function containsOnlyOneWord(data: any): string {
  const typeOfData = typeof data;

  if (typeOfData === 'string') {
    return normalizeTitleTerm((data as string).split(' ')[0]);
  }

  if (typeOfData === 'object' && Array.isArray(data)) {
    return normalizeTitleTerm(`${data[0]}`);
  }

  return '';
}
