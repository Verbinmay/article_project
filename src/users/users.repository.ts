import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDB } from '../db/entities/userDB.entity';
import { User } from './entities/user.entity';
import { IUsersRepository } from './interfaces/users-repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserDB)
    private readonly usersRepository: Repository<UserDB>,
  ) {}
  async save(user: User): Promise<User> {
    try {
      const userFromDb: UserDB = await this.usersRepository.save(user);
      return this.toDomain(userFromDb);
    } catch (error) {
      throw new Error(`Failed to save user: ${error}`);
    }
  }

  async isLoginTaken(login: string): Promise<boolean> {
    try {
      const user = await this.usersRepository.findOneBy({ login });
      return !!user;
    } catch (error) {
      throw new Error(`Failed to check if login is taken: ${error}`);
    }
  }

  async findByLogin(login: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOneBy({ login });
      return user ? this.toDomain(user) : null;
    } catch (error) {
      throw new Error(`Failed to find user by login: ${error}`);
    }
  }

  private toDomain(entity: UserDB): User {
    return new User({ ...entity });
  }
}
