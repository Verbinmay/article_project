import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserDB } from './userDB.entity';

@Entity()
export class ArticleDB {
  @Column({ primary: true })
  public id: string;

  @Column({ nullable: false })
  public title: string;

  @Column({ nullable: false })
  public text: string;

  @Column({ nullable: false, type: 'timestamp' })
  public date: Date;

  @ManyToOne(() => UserDB, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: UserDB;

  @Column({ name: 'authorId' })
  authorId: string;
}
