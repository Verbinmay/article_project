/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

import { BUSINESS_SETTINGS } from '../../app/settings/business-settings';
import { textErrorGenerator } from '../../app/utils/text-error-generator';

const loginConstraints = BUSINESS_SETTINGS.user.login;
const passwordConstraints = BUSINESS_SETTINGS.user.password;
const firstNameConstraints = BUSINESS_SETTINGS.user.firstName;
const lastNameConstraints = BUSINESS_SETTINGS.user.lastName;

export class RegistrationInputDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: textErrorGenerator.beString('Login') })
  @Length(loginConstraints.minLength, loginConstraints.maxLength, {
    message: textErrorGenerator.beBetween(
      'Login',
      loginConstraints.minLength,
      loginConstraints.maxLength,
    ),
  })
  login: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: textErrorGenerator.beString('Password') })
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength, {
    message: textErrorGenerator.beBetween(
      'Password',
      passwordConstraints.minLength,
      passwordConstraints.maxLength,
    ),
  })
  @Matches(passwordConstraints.regex, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: textErrorGenerator.beString('First name') })
  @Length(firstNameConstraints.minLength, firstNameConstraints.maxLength, {
    message: textErrorGenerator.beBetween(
      'First name',
      firstNameConstraints.minLength,
      firstNameConstraints.maxLength,
    ),
  })
  firstName: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: textErrorGenerator.beString('Last name') })
  @Length(lastNameConstraints.minLength, lastNameConstraints.maxLength, {
    message: textErrorGenerator.beBetween(
      'Last name',
      lastNameConstraints.minLength,
      lastNameConstraints.maxLength,
    ),
  })
  lastName: string;
}
