import { format } from "date-fns";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarPlus, CircleUserRound, Loader2 } from "lucide-react";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import useAuth from "@/hooks/useAuth";
import ISubreddit from "@/models/subreddit";
import responseError from "@/models/error";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import MinicreatePost from "@/components/MinicreatePost";

enum subscriptionState {
  SUBSCRIBED = "SUBSCRIBED",
  NOT_SUBSCRIBED = "NOT_SUBSCRIBED",
  ONWER = "ONWER",
}

const Subreddit = () => {
  const { slug } = useParams();
  const { axiosClinetWithToken, user } = useAuth();
  const [subscribeState, setSubscribeState] =
    useState<subscriptionState | null>(null);
  const [membersCount, setMembersCount] = useState(0);

  const { data: subreddit, isLoading } = useQuery({
    queryKey: ["subreddit"],
    queryFn: async () => {
      const response = await axiosClinetWithToken.get(`/subreddit/${slug}`);
      const data = response.data.data as ISubreddit;
      setMembersCount(data.subscribers.length);
      if (data.onwerId === user?.id) {
        setSubscribeState(subscriptionState.ONWER);
      } else if (user?.subreddits.some((sub) => sub.subredditId === data.id)) {
        setSubscribeState(subscriptionState.SUBSCRIBED);
      } else {
        setSubscribeState(subscriptionState.NOT_SUBSCRIBED);
      }
      return data;
    },
  });

  const { mutate: joinSubreddit, isPending } = useMutation({
    mutationKey: ["joinSubreddit"],
    mutationFn: async (id: string) => {
      await axiosClinetWithToken.post(`/subscription/${id}/join`);
      setSubscribeState(subscriptionState.SUBSCRIBED);
      setMembersCount((prev) => prev + 1);
    },
    onError: (error: responseError) => {
      if (error.response.status === 409) {
        toast.error("Already subscribed");
      } else if (error.response.status === 400) {
        toast.error("Bad request , please try again");
      } else {
        toast.error("Something went wrong , please try again");
      }
    },
  });

  const { mutate: leaveSubreddit } = useMutation({
    mutationKey: ["leaveSubreddit"],
    mutationFn: async (id: string) => {
      await axiosClinetWithToken.delete(`/subscription/${id}/leave`);
      setSubscribeState(subscriptionState.NOT_SUBSCRIBED);
      setMembersCount((prev) => prev - 1);
    },
    onError: (error: responseError) => {
      if (error.response.status === 400) {
        toast.error("Bad request , please try again");
      } else {
        toast.error("Something went wrong , please try again");
      }
    },
  });

  const handleSubscribe = async (id: string) => {
    if (subscribeState === subscriptionState.SUBSCRIBED) {
      leaveSubreddit(id);
    } else {
      joinSubreddit(id);
    }
  };

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
                    Members: {membersCount}
                  </p>
                </div>
                {subscribeState === subscriptionState.ONWER && (
                  <p className="text-sm text-muted-foreground">
                    You are the owner of this sub
                  </p>
                )}
                <NavLink
                  to={"/post/create"}
                  className={buttonVariants({ className: "w-full text-xl " })}
                >
                  Create Post
                </NavLink>
                {subscribeState !== subscriptionState.ONWER && (
                  <Button
                    onClick={() => handleSubscribe(subreddit?.id as string)}
                    className={cn(
                      buttonVariants({ className: "w-full text-lg " }),
                      subscribeState === subscriptionState.SUBSCRIBED &&
                        "bg-green-600"
                    )}
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {subscribeState === subscriptionState.SUBSCRIBED
                      ? "Joined"
                      : "Join this Sub"}
                  </Button>
                )}
              </div>
            </div>
            {/* TODO: ADD Timeline  */}
            <div className="md:col-span-2">
              <MinicreatePost />
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default Subreddit;
