/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { BUSINESS_SETTINGS } from '../../app/settings/business-settings';
import { textErrorGenerator } from '../../app/utils/text-error-generator';

const titleConstraints = BUSINESS_SETTINGS.article.title;
const textConstraints = BUSINESS_SETTINGS.article.text;

export class NewArticleInputDto {
  @IsString({ message: textErrorGenerator.beString('Title') })
  @Length(titleConstraints.minLength, titleConstraints.maxLength, {
    message: textErrorGenerator.beBetween(
      'Title',
      titleConstraints.minLength,
      titleConstraints.maxLength,
    ),
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  @IsString({ message: textErrorGenerator.beString('Text') })
  @Length(textConstraints.minLength, textConstraints.maxLength, {
    message: textErrorGenerator.beBetween(
      'Text',
      textConstraints.minLength,
      textConstraints.maxLength,
    ),
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  text: string;
}
