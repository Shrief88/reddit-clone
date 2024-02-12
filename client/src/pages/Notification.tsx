import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Separator } from "@/components/ui/separator";
import useToken from "@/hooks/useToken";
import { INotification } from "@/models/notification";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import NotificationDiv from "@/components/layout/navbar/NotificationDiv";
import NotificationSkeleton from "@/components/skeleton/NotificationSkeleton";

const Notification = () => {
  const { axiosClientAuth } = useToken();

  const lastPostRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["notificationsInfinite"],
    queryFn: async ({ pageParam = 1 }): Promise<INotification[]> => {
      const { data } = await axiosClientAuth.get("/notification", {
        params: {
          page: pageParam,
        },
      });
      return data.data as INotification[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const notifications: INotification[] =
    data?.pages.flatMap((page) => page) || [];

  return (
    <MaxWidthWrapper className="md:px-56 mt-5">
      <div className="rounded-lg border border-border shadow-md ">
        <div className=" bg-card">
          <div className="w-full p-4">
            <h1 className="text-xl font-bold pb-3">Notification Center</h1>
            <Separator />
            {isLoading && [1, 2, 3, 4].map(() => <NotificationSkeleton />)}
            {notifications.length > 0 ? (
              notifications.map((notification, index) => {
                // I added posts.length > 1 to fix bug with last post when there is only 1 post
                if (
                  index === notifications.length - 1 &&
                  notifications.length > 9
                ) {
                  return (
                    <div key={notification.id} ref={ref}>
                      <NotificationDiv notification={notification} />
                    </div>
                  );
                } else {
                  return (
                    <NotificationDiv
                      notification={notification}
                      key={notification.id}
                    />
                  );
                }
              })
            ) : (
              <div className="flex justify-center">
                <p className="text-muted-foreground pt-4">
                  No notifications to show
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Notification;
