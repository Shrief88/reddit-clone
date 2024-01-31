export enum VoteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downVote",
}

export interface IPostVote {
  userId: string;
  postId: string;
  type: VoteType;
}

export interface ICommentVote {
  userId: string;
  commentId: string;
  type: VoteType;
}
