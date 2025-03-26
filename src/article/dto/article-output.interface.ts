import { IUserOutput } from '../../users/interfaces/user-output.interface';

export interface IArticleOutput {
  id: string;
  title: string;
  text: string;
  date: string;
  author: IUserOutput;
}
