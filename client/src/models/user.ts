import ISubreddit from "./subreddit";
import ISubscription from "./subscription";

interface IUser {
  id: string;
  username: string;
  email: string;
  image: string;
  googleId: string;
  subreddits: ISubscription[];
  createdAt: Date;
  ownedSubreddits: ISubreddit[];
  followers: IFollows[];
  following: IFollows[];
}

interface IFollows {
  followerId: string;
  followingId: string;
}

export default IUser;
