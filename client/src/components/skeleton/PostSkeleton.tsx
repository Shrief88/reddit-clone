import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="rounded-md bg-card shadow">
      <div className="p-4">
        <div className="flex flex-col gap-4 border-b border-b-input mb-3 pb-3">
          <Skeleton className="w-1/3 h-6" />
          <Skeleton className="w-full h-36" />
        </div>
        <Skeleton className="w-1/3 h-8" />
      </div>
    </div>
  );
};

export default PostSkeleton;
