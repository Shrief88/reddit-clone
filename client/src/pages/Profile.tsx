import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router-dom";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleUserRound, Calendar, Flower } from "lucide-react";

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
import Follow from "@/components/Follow";
import UpdateImage from "@/components/dialoags/UpdateImage";
import UserAvatar from "@/components/UserAvatar";

const Profile = () => {
  const { axiosClientAuth } = useToken();
  const { username } = useParams();
  const { user: currentUser } = useAuth();

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
    <MaxWidthWrapper className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {isLoading && (
          <div className="md:order-last">
            <InfoSkeleton />
          </div>
        )}
        {!isLoading  && (
          <div className="h-fit rounded-lg border border-border shadow-md md:col-span-1 md:order-last">
            <div className="bg-card px-6 py-4">
              <div className="flex items-center gap-3">
                <CircleUserRound size={30} />
                <p className="font-semibold text-2xl">u/{user?.username}</p>
              </div>
            </div>

            <Separator />
            <div className="flex flex-col gap-3 px-6 py-6 bg-card text-muted-foreground">
              <div className="flex justify-center items-center">
                <UserAvatar
                  image={user?.image}
                  username={user?.username}
                  className="w-40 h-40 mb-3 "
                  textSize="text-7xl"
                />
              </div>

              {currentUser?.id === user?.id && (
                <p className="text-center font-bold">
                  your personal Breddit frontpage.
                </p>
              )}

              <div className="text-sm flex items-center gap-2">
                <Calendar />
                <p className="text-sm">
                  {" "}
                  Joined at: {new Date(user?.createdAt as Date).toDateString()}
                </p>
              </div>
              <div className="text-sm flex items-center gap-2">
                <Flower />
                <p className="text-sm"> Karma: {karma}</p>
              </div>

              <div className="text-sm flex items-center gap-2">
                <CircleUserRound />
                <p className="text-sm">Followers: {user?.followers.length}</p>
              </div>

              {currentUser?.id === user?.id && (
                <>
                  <CreateSubreddit />
                  <Button variant="outline">
                    <NavLink to="/post/create/r/">Create Post</NavLink>
                  </Button>
                  <UpdateUsername username={user?.username as string} />
                  <UpdateImage />
                </>
              )}

              {currentUser?.id !== user?.id && <Follow user={user as IUser} />}
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex flex-col gap-8">
          <MinicreatePost />
          {username === currentUser?.username ? (
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
                      queryKey={user.id as string}
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
          ) : (
            !isLoading &&
            user && (
              <PostFeed
                isHome={true}
                queryFn={getUserPosts}
                queryKey={user?.id as string}
              />
            )
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Profile;
