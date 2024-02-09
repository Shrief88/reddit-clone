import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { CircleUserRound, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

import ISubreddit from "@/models/subreddit";
import responseError from "@/models/error";
import useToken from "@/hooks/useToken";
import useAuth from "@/hooks/useAuth";
import UpdateSubreddit from "./dialoags/updateSubreddit";
import { Separator } from "./ui/separator";

interface SubriddetInfoProps {
  subreddit: ISubreddit | undefined;
}

enum subscriptionState {
  SUBSCRIBED = "SUBSCRIBED",
  NOT_SUBSCRIBED = "NOT_SUBSCRIBED",
  ONWER = "ONWER",
}

const SubriddetInfo = (props: SubriddetInfoProps) => {
  const { user } = useAuth();
  const { axiosClientAuth } = useToken();
  const queryClient = useQueryClient();
  const [subscribeState, setSubscribeState] =
    useState<subscriptionState | null>(null);
  const [membersCount, setMembersCount] = useState(0);

  useEffect(() => {
    const sub = props.subreddit;
    setMembersCount(sub?.subscribers.length || 0);
    if (sub?.onwerId === user?.id) {
      setSubscribeState(subscriptionState.ONWER);
    } else {
      if (sub?.subscribers.some((sub) => sub.userId === user?.id)) {
        setSubscribeState(subscriptionState.SUBSCRIBED);
      } else {
        setSubscribeState(subscriptionState.NOT_SUBSCRIBED);
      }
    }
  }, [props.subreddit, user?.id]);

  const { mutate: joinSubreddit, isPending } = useMutation({
    mutationKey: ["joinSubreddit"],
    mutationFn: async (id: string) => {
      await axiosClientAuth.post(`/subscription/${id}/join`);
    },
    onSuccess: () => {
      setSubscribeState(subscriptionState.SUBSCRIBED);
      setMembersCount((prev) => prev + 1);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
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
      await axiosClientAuth.delete(`/subscription/${id}/leave`);
    },
    onSuccess: () => {
      setSubscribeState(subscriptionState.NOT_SUBSCRIBED);
      setMembersCount((prev) => prev - 1);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
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
    <div className="h-fit rounded-lg border border-border shadow-md ">
      <div className="bg-card px-2 py-4 pl-6">
        <div className="flex items-center gap-3">
          <p className="font-semibold text-xl ">
            About r/{props.subreddit?.name}
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-3 px-6 py-6 bg-card ">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground text-left">
            {props.subreddit?.description}
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

        {subscribeState === subscriptionState.ONWER && (
          <UpdateSubreddit
            oldDecription={props.subreddit?.description as string}
            subredditId={props.subreddit?.id as string}
          />
        )}

        <NavLink
          to={"/post/create/r/" + props.subreddit?.name}
          className={buttonVariants({ variant: "outline" })}
        >
          Create Post
        </NavLink>
        {subscribeState !== subscriptionState.ONWER && (
          <Button
            onClick={() => handleSubscribe(props.subreddit?.id as string)}
            className={cn(
              buttonVariants({ className: "w-full text-lg" }),
              subscribeState === subscriptionState.SUBSCRIBED && "bg-green-600"
            )}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {subscribeState === subscriptionState.SUBSCRIBED
              ? "Joined"
              : "Join this Sub"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubriddetInfo;
