import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import ISubreddit from "@/models/subreddit";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router-dom";
import { CalendarPlus, CircleUserRound } from "lucide-react";
import { format } from "date-fns";

const Subreddit = () => {
  const { slug } = useParams();
  const { axiosClinetWithToken } = useAuth();
  const { data: subreddit, isLoading } = useQuery({
    queryKey: ["subreddit"],
    queryFn: async () => {
      const response = await axiosClinetWithToken.get(`/subreddit/${slug}`);
      return response.data.data as ISubreddit;
    },
  });

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper>
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="h-fit rounded-lg border border-gray-200 shadow-md md:col-span-1 md:order-last">
              <div className="bg-emerald-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-3xl">r/{subreddit?.slug}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 px-6 py-6 bg-background ">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground text-left">
                    {subreddit?.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarPlus />
                  <p className="text-sm text-muted-foreground">
                    Created At:{" "}
                    {format(subreddit?.createdAt as Date, "dd MMM yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <CircleUserRound />
                  <p className="text-sm text-muted-foreground">
                    Members: {subreddit?.subscribers.length}
                  </p>
                </div>
                <NavLink
                  to={"/post/create"}
                  className={buttonVariants({ className: "w-full text-lg " })}
                >
                  Create Post
                </NavLink>
                <NavLink
                  to={"/post/create"}
                  className={buttonVariants({ className: "w-full text-lg " })}
                >
                  Join Subredddit
                </NavLink>
              </div>
            </div>
            {/* TODO: ADD Timeline  */}
            <div className="md:col-span-2">Hello</div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default Subreddit;
