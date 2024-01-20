export interface ISubreddit {
  id: string;
  name: string;
  slug : string;
  description : string;
  onwerId : string;
  createdAt : Date;
  subscribers: [];
}

export default ISubreddit;