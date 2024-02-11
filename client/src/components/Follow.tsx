import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Button } from "./ui/button";

import { useSocket } from "@/context/Socket";
import useAuth from "@/hooks/useAuth";
import useToken from "@/hooks/useToken";
import IUser from "@/models/user";


enum followingState {
  FOLLOWING = "FOLLOWING",
  NOT_FOLLOWING = "NOT_FOLLOWING",
}

interface IFollowProps {
  user: IUser;
}

const Follow = ({ user }: IFollowProps) => {
  const { axiosClientAuth } = useToken();
  const { user: currentUser } = useAuth();
  const [followState, setFollowState] = useState<followingState>(
    followingState.NOT_FOLLOWING
  );
  const socket = useSocket();

  useEffect(() => {
    if (user) {
      const isfollowing = user?.followers.some(
        (follower) => follower.followingId === user?.id
      );

      isfollowing
        ? setFollowState(followingState.FOLLOWING)
        : setFollowState(followingState.NOT_FOLLOWING);
    }
  }, [user]);

  const { mutate: follow } = useMutation({
    mutationKey: ["follow", user?.username],
    mutationFn: async () => {
      toast.loading("Following...");
      await axiosClientAuth.post(`follow/${user?.id}`);
    },
    onSuccess: () => {
      socket?.emit(
        "notification",
        currentUser?.username,
        user?.username,
        "account_follow",
        `/u/${currentUser?.username}`,
        user.id
      );
      toast.dismiss();
      toast.success("Followed");
      setFollowState(followingState.FOLLOWING);
      // queryClient.invalidateQueries({ queryKey: ["user", user?.username] });
      // queryClient.invalidateQueries({
      //   queryKey: ["user"],
      // });
    },
  });

  const { mutate: unfollow } = useMutation({
    mutationKey: ["unfollow", user?.username],
    mutationFn: async () => {
      toast.loading("Unfollowing...");
      await axiosClientAuth.delete(`follow/${user?.id}`);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Unfollowed");
      setFollowState(followingState.NOT_FOLLOWING);
      // queryClient.invalidateQueries({ queryKey: ["user", user?.username] });
      // queryClient.invalidateQueries({
      //   queryKey: ["user"],
      // });
    },
  });

  const handleFollowing = () => {
    if (followState === followingState.FOLLOWING) {
      unfollow();
    } else {
      follow();
    }
  };

  return (
    <Button onClick={handleFollowing} variant={"outline"}>
      {followState === followingState.FOLLOWING ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default Follow;
