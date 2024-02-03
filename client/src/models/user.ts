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
}

export default IUser;
