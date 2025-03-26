import { User } from '../../users/entities/user.entity';

export class CreateArticleDto {
  public title: string;
  public text: string;
  public author: User;
}
