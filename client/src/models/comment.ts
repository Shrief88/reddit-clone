import { ICommentVote } from "./vote";

export interface IComment {
  id : string;
  text : string;
  createdAt : Date;
  updatedAt : Date;
  authorId : string;
  replyToId : string | null;
  votes : ICommentVote[];
}