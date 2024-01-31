import { ICommentVote } from "./vote";
import IUser from "./user";

export interface IComment {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  author: IUser;
  replyToId: string | null;
  votes: ICommentVote[];
}
