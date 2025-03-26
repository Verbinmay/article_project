import { User } from '../entities/user.entity';

export interface IUsersRepository {
  save(user: User): Promise<User>;
  isLoginTaken(login: string): Promise<boolean>;
  findByLogin(login: string): Promise<User | null>;
}
