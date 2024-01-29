export enum VoteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downVote",
}

export interface IVote {
  userId: string;
  postId: string;
  type: VoteType;
}
