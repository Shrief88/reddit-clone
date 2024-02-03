import MinicreatePost from "@/components/MinicreatePost";
import PostFeed from "@/components/PostFeed";
import CreateSubreddit from "@/components/dialoags/CreateSubreddit";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import useToken from "@/hooks/useToken";
import { IExtendedPost } from "@/models/post";
import IUser from "@/models/user";
import { useQuery } from "@tanstack/react-query";
import { CircleUserRound, Calendar, Flower } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

const Profile = () => {
  const { axiosClientAuth } = useToken();
  const { username } = useParams();

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

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
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
                  Joined at: {new Date(user?.createdAt as Date).toDateString()}
                </p>
              </div>
              <div className="text-sm flex items-center gap-2">
                <Flower />
                <p className="text-sm"> Karma: {karma}</p>
              </div>

              <CreateSubreddit />
              <Button variant="outline">
                <NavLink to="/post/create/r/">Create Post</NavLink>
              </Button>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-8">
            <MinicreatePost />
            {!isLoading && user && (
              <PostFeed
                isHome={true}
                queryFn={getUserPosts}
                queryKey={user?.id as string}
              />
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Profile;
