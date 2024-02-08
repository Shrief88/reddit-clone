import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleUserRound, Calendar, Flower } from "lucide-react";
import { toast } from "sonner";

import MinicreatePost from "@/components/MinicreatePost";
import PostFeed from "@/components/post/PostFeed";
import CreateSubreddit from "@/components/dialoags/CreateSubreddit";
import useAuth from "@/hooks/useAuth";
import useToken from "@/hooks/useToken";
import { IExtendedPost } from "@/models/post";
import IUser from "@/models/user";
import UpdateUsername from "@/components/dialoags/UpdateUsername";
import { Separator } from "@/components/ui/separator";
import InfoSkeleton from "@/components/skeleton/InfoSkeleton";
import { useSocket } from "@/context/Socket";

enum followingState {
  FOLLOWING = "FOLLOWING",
  NOT_FOLLOWING = "NOT_FOLLOWING",
}

const Profile = () => {
  const { axiosClientAuth } = useToken();
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [followState, setFollowState] = useState<followingState | null>(null);
  const queryClient = useQueryClient();
  const socket = useSocket();

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
      socket?.emit(
        "notification",
        currentUser?.username,
        user?.username,
        "account_follow"
      );
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
    const res = await axiosClientAuth.get(
      `post/saved/me?limit=${5}&page=${page}`
    );
    return res.data.data as IExtendedPost[];
  };

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          {isLoading && (
            <div className="md:order-last">
              <InfoSkeleton />
            </div>
          )}
          {!isLoading && (
            <div className="h-fit rounded-lg border border-border shadow-md md:col-span-1 md:order-last">
              <div className="bg-background px-6 py-4">
                <div className="flex items-center gap-3">
                  <CircleUserRound size={30} />
                  <p className="font-semibold text-2xl">u/{user?.username}</p>
                </div>
              </div>

              <Separator />
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
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all" className="text-md rounded-md">
                    Your posts
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="text-md rounded-md">
                    Saved
                  </TabsTrigger>
                </TabsList>
                {!isLoading && user && (
                  <>
                    <TabsContent value="all">
                      <PostFeed
                        isHome={true}
                        queryFn={getUserPosts}
                        queryKey={user?.id as string}
                      />
                    </TabsContent>

                    <TabsContent value="saved">
                      <PostFeed
                        isHome={true}
                        queryFn={getUserSavedPosts}
                        queryKey="saved"
                      />
                    </TabsContent>
                  </>
                )}
              </Tabs>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Profile;
