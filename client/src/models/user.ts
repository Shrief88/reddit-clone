import ISubreddit from "./subreddit";
import ISubscription from "./subscription";
import { INotification } from "./notification";

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
  receivedNotifications: INotification[];
}

interface IFollows {
  followerId: string;
  followingId: string;
}

export default IUser;
