import { Column, Entity, Index, OneToMany } from 'typeorm';

import { ArticleDB } from './articleDB.entity';

@Entity()
export class UserDB {
  @Column({ primary: true })
  public id: string;

  @Column({ nullable: false })
  public firstName: string;

  @Column({ nullable: false })
  public lastName: string;

  @Index({ unique: true })
  @Column({ nullable: false })
  public login: string;

  @Column({ nullable: false })
  public hash: string;

  @OneToMany(() => ArticleDB, (article) => article.author)
  articles: ArticleDB[];
}
