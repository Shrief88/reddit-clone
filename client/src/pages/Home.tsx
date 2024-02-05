import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

import { IExtendedPost } from "@/models/post";
import CreateSubreddit from "@/components/dialoags/CreateSubreddit";
import MinicreatePost from "@/components/MinicreatePost";
import PostFeed from "@/components/PostFeed";
import useToken from "@/hooks/useToken";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

enum DisplayPostModes {
  FOLLOWING = "following",
  ALL = "all",
}

const Home = () => {
  const { axiosClientAuth } = useToken();
  const { user } = useAuth();

  const [displayMode, setDisplayMode] = useState<DisplayPostModes>(
    DisplayPostModes.FOLLOWING
  );

  useEffect(() => {
    user?.subreddits.length || user?.following.length
      ? setDisplayMode(DisplayPostModes.FOLLOWING)
      : setDisplayMode(DisplayPostModes.ALL);
  }, [user]);

  const getFollowingPosts = async (page: number) => {
    const res = await axiosClientAuth.get(
      `/post/following/me?limit=${5}&page=${page}`
    );
    return res.data.data as IExtendedPost[];
  };

  const getAllPosts = async (page: number) => {
    const res = await axiosClientAuth.get(`/post?limit=${5}&page=${page}`);
    return res.data.data as IExtendedPost[];
  };

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="h-fit rounded-lg border border-gray-200 shadow-md md:col-span-1 md:order-last">
            <div className="bg-emerald-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <HomeIcon />
                <p className="font-semibold text-3xl">Home</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-6 py-6 bg-background ">
              <div className="flex justify-between py-2">
                <p className="text-sm text-muted-foreground text-center">
                  Your personal Reddit frontpage. Come here to check in with
                  your favorite communities.
                </p>
              </div>
              <CreateSubreddit />
              <NavLink
                className={buttonVariants({ variant: "secondary" })}
                to={"/post/create/r"}
              >
                Create Post
              </NavLink>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-8">
            <MinicreatePost />
            <div className="grid grid-cols-2 justify-center border-b border-b-gray-200 -mb-6">
              <Button
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-muted-foreground text-md bg-slate",
                  displayMode === "following" &&
                    "text-blue-900 border-b border-blue-900 rounded-none font-bold"
                )}
                onClick={() => setDisplayMode(DisplayPostModes.FOLLOWING)}
              >
                Following
              </Button>
              <Button
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-muted-foreground text-md bg-slate",
                  displayMode === "all" &&
                    "text-blue-900 border-b border-blue-900 rounded-none font-bold"
                )}
                onClick={() => setDisplayMode(DisplayPostModes.ALL)}
              >
                For you
              </Button>
            </div>
            {displayMode === DisplayPostModes.FOLLOWING ? (
              <PostFeed
                isHome={true}
                queryFn={getFollowingPosts}
                queryKey="home"
              />
            ) : (
              <PostFeed isHome={true} queryFn={getAllPosts} queryKey="forYou" />
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Home;
