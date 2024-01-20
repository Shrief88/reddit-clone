import ISubscription from "./subscription";

export interface ISubreddit {
  id: string;
  name: string;
  slug: string;
  description: string;
  onwerId: string;
  createdAt: Date;
  subscribers: ISubscription[];
}

export default ISubreddit;
