import { randomUUID } from 'crypto';

import { CreateUserDto } from '../dto/create-user.dto';
import { IUserOutput } from '../interfaces/user-output.interface';

export class User {
  public id: string;
  public login: string;
  public firstName: string;
  public lastName: string;
  public hash: string;

  constructor(data: CreateUserDto & { id: string }) {
    this.id = data.id;
    this.login = data.login;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.hash = data.hash;
  }

  static create(data: CreateUserDto): User {
    const id = randomUUID() as string;
    return new User({ ...data, id });
  }
  toPublicEntity(): IUserOutput {
    return {
      login: this.login,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}
