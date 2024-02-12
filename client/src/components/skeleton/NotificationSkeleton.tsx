import { Skeleton } from "../ui/skeleton";

const NotificationSkeleton = () => {
  return <div className="flex items-center gap-2 h-16 px-2">
    <Skeleton className="w-10 h-10 rounded-full" />
    <Skeleton className="w-2/3 h-8" />
  </div>;
};

export default NotificationSkeleton;
