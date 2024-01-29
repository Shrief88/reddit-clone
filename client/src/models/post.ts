import { IComment } from "./comment";
import ISubreddit from "./subreddit";
import IUser from "./user";
import { IVote } from "./vote";

export interface IPost {
  id: string;
  title: string;
  content: string;
  subredditId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExtendedPost extends IPost {
  subreddit : ISubreddit,
  author : IUser,
  comments: IComment[],
  image : string,
  votes : IVote[]
}