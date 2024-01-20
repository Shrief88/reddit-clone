import { ISubreddit } from "./subreddit";

interface User {
  id: string;
  name: string;
  email: string;
  image : string;
  googleId: string;
  subreddits : ISubreddit[];
  createdAt: Date;
  ownedSubreddits : ISubreddit[];
}

export default User;