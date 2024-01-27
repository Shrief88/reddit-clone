import { IExtendedPost } from "./post";
import ISubscription from "./subscription";

export interface ISubreddit {
  id: string;
  name: string;
  description: string;
  onwerId: string;
  createdAt: Date;
  subscribers: ISubscription[];
  posts : IExtendedPost[];
}

export default ISubreddit;
