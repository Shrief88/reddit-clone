import { IComment } from "./comment";
import ISubreddit from "./subreddit";
import IUser from "./user";
import { IPostVote } from "./vote";

interface SavedPosts {
  userId: string;
  postId: string;
}

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
  subreddit: ISubreddit;
  author: IUser;
  comments: IComment[];
  image: string;
  votes: IPostVote[];
  savedBy: SavedPosts[];
}
