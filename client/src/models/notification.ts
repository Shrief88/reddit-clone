import IUser from "./user";

interface INotificationType {
  id: string;
  name: string;
  message: string;
}

export interface INotification {
  id: string;
  sender: IUser;
  receiverId: string;
  type: INotificationType;
  createdAt: Date;
  seen: boolean;
  url: string;
}
