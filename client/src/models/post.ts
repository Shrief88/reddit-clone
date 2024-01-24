export interface IPost {
  id: string;
  title: string;
  content: string;
  subredditId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
