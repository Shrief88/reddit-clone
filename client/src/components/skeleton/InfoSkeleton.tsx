import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

const InfoSkeleton = () => {
  return (
    <div className="h-fit rounded-lg border border-border shadow-md bg-card">
      <div className="px-2 py-4 pl-6">
        <Skeleton className="w-2/3 h-8" />
      </div>
      <Separator />
      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex justify-center">
          <Skeleton className="w-2/3 h-7" />
        </div>
        <Skeleton className="w-2/3 h-7" />
        <Skeleton className="w-2/3 h-7" />
      </div>
    </div>
  );
};

export default InfoSkeleton;
