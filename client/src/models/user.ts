import ISubreddit from "./subreddit";
import ISubscription from "./subscription";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  googleId: string;
  subreddits: ISubscription[];
  createdAt: Date;
  ownedSubreddits: ISubreddit[];
}

export default User;
