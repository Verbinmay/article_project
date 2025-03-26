import { randomUUID } from 'crypto';

import { format } from '@formkit/tempo';

import { User } from '../../users/entities/user.entity';
import { IArticleOutput } from '../dto/article-output.interface';
import { CreateArticleDto } from '../dto/create-article.dto';

export class Article {
  public id: string;
  public title: string;
  public text: string;
  public date: Date;
  public author: User;

  constructor(data: CreateArticleDto & { id: string; date: Date }) {
    this.id = data.id;
    this.title = data.title;
    this.text = data.text;
    this.date = data.date;
    this.author = data.author;
  }

  static create(data: CreateArticleDto): Article {
    const id = randomUUID();
    const date = new Date();
    return new Article({ ...data, id, date });
  }

  toPublicEntity(): IArticleOutput {
    return {
      id: this.id,
      title: this.title,
      text: this.text,
      date: format(this.date, 'long'),
      author: this.author.toPublicEntity(),
    };
  }
}
