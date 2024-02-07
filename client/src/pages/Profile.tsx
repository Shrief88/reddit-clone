import MinicreatePost from "@/components/MinicreatePost";
import PostFeed from "@/components/PostFeed";
import CreateSubreddit from "@/components/dialoags/CreateSubreddit";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import useToken from "@/hooks/useToken";
import { IExtendedPost } from "@/models/post";
import IUser from "@/models/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleUserRound, Calendar, Flower } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "sonner";
import UpdateUsername from "@/components/dialoags/UpdateUsername";
import { cn } from "@/lib/utils";

enum followingState {
  FOLLOWING = "FOLLOWING",
  NOT_FOLLOWING = "NOT_FOLLOWING",
}

enum DisplayPostModes {
  SAVED = "saved",
  ALL = "all",
}

const Profile = () => {
  const { axiosClientAuth } = useToken();
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [followState, setFollowState] = useState<followingState | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayPostModes>(
    DisplayPostModes.ALL
  );
  const queryClient = useQueryClient();

  const { data: karma } = useQuery({
    queryKey: ["karma", username],
    queryFn: async () => {
      const res = await axiosClientAuth.get(`users/karma/${username}`);
      return res.data.karma as number;
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const res = await axiosClientAuth.get(`users/${username}`);
      return res.data.data as IUser;
    },
  });

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
      toast.dismiss();
      toast.success("Followed");
      queryClient.invalidateQueries({ queryKey: ["user", user?.username] });
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
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
      queryClient.invalidateQueries({ queryKey: ["user", user?.username] });
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const handleFollowing = () => {
    if (followState === followingState.FOLLOWING) {
      unfollow();
    } else {
      follow();
    }
  };

  const getUserPosts = async (page: number) => {
    const res = await axiosClientAuth.get(
      `/post?limit=${5}&page=${page}&authorId=${user?.id}`
    );
    return res.data.data as IExtendedPost[];
  };

  const getUserSavedPosts = async (page: number) => {
    const res = await axiosClientAuth.get(`post/saved/me?limit=${5}&page=${page}`);
    return res.data.data as IExtendedPost[];
  };

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          {!isLoading && (
            <div className="h-fit rounded-lg border border-gray-200 shadow-md md:col-span-1 md:order-last">
              <div className="bg-emerald-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <CircleUserRound size={30} />
                  <p className="font-semibold text-2xl">u/{user?.username}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 px-6 py-6 bg-background text-muted-foreground">
                <p className="text-center font-bold">
                  your personal Breddit frontpage.
                </p>
                <div className="text-sm flex items-center gap-2">
                  <Calendar />
                  <p className="text-sm">
                    {" "}
                    Joined at:{" "}
                    {new Date(user?.createdAt as Date).toDateString()}
                  </p>
                </div>
                <div className="text-sm flex items-center gap-2">
                  <Flower />
                  <p className="text-sm"> Karma: {karma}</p>
                </div>

                <div className="text-sm flex items-center gap-2">
                  <CircleUserRound />
                  <p className="text-sm">
                    {" "}
                    Followers: {user?.followers.length}
                  </p>
                </div>

                <CreateSubreddit />
                <Button variant="outline">
                  <NavLink to="/post/create/r/">Create Post</NavLink>
                </Button>

                {currentUser?.id !== user?.id && (
                  <Button onClick={handleFollowing} variant={"outline"}>
                    {followState === followingState.FOLLOWING
                      ? "Unfollow"
                      : "Follow"}
                  </Button>
                )}

                {currentUser?.id === user?.id && (
                  <UpdateUsername username={user?.username as string} />
                )}
              </div>
            </div>
          )}

          <div className="md:col-span-2 flex flex-col gap-8">
            <MinicreatePost />
            {username === currentUser?.username && (
              <div className="grid grid-cols-2 justify-center border-b border-b-gray-200 -mb-6">
                <Button
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "text-muted-foreground text-md bg-slate",
                    displayMode === "all" &&
                      "text-blue-900 border-b border-blue-900 rounded-none font-bold"
                  )}
                  onClick={() => setDisplayMode(DisplayPostModes.ALL)}
                >
                  Your Posts
                </Button>
                <Button
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "text-muted-foreground text-md bg-slate",
                    displayMode === "saved" &&
                      "text-blue-900 border-b border-blue-900 rounded-none font-bold"
                  )}
                  onClick={() => setDisplayMode(DisplayPostModes.SAVED)}
                >
                  Saved
                </Button>
              </div>
            )}
            {!isLoading &&
              user &&
              (displayMode === DisplayPostModes.SAVED ? (
                <PostFeed
                  isHome={true}
                  queryFn={getUserSavedPosts}
                  queryKey="saved"
                />
              ) : (
                <PostFeed
                  isHome={true}
                  queryFn={getUserPosts}
                  queryKey={user?.id as string}
                />
              ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Profile;
