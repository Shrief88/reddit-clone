import { NavLink } from "react-router-dom";
import { useState } from "react";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IExtendedPost } from "@/models/post";
import CreateSubreddit from "@/components/dialoags/CreateSubreddit";
import MinicreatePost from "@/components/MinicreatePost";
import PostFeed from "@/components/post/PostFeed";
import useToken from "@/hooks/useToken";
import { Separator } from "@/components/ui/separator";

enum DisplayPostModes {
  FOLLOWING = "following",
  ALL = "all",
}

const Home = () => {
  const { axiosClientAuth } = useToken();
  const [displayMode, setDisplayMode] = useState<DisplayPostModes>(
    DisplayPostModes.FOLLOWING
  );

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
    <MaxWidthWrapper className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="h-fit rounded-lg border border-border shadow-md md:col-span-1 md:order-last">
          <div className="bg-card px-6 py-4">
            <div className="flex items-center gap-3">
              <HomeIcon />
              <p className="font-semibold text-3xl">Home</p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 px-6 py-6 bg-card ">
            <div className="flex justify-between py-2">
              <p className="text-sm text-muted-foreground text-center">
                Your personal Reddit frontpage. Come here to check in with your
                favorite communities.
              </p>
            </div>
            <CreateSubreddit />
            <NavLink
              className={buttonVariants({ variant: "outline" })}
              to={"/post/create/r"}
            >
              Create Post
            </NavLink>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-8">
          <MinicreatePost />
          <Tabs value={displayMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="following"
                onClick={() => setDisplayMode(DisplayPostModes.FOLLOWING)}
                className="text-md rounded-md"
              >
                Following
              </TabsTrigger>
              <TabsTrigger
                value="all"
                onClick={() => setDisplayMode(DisplayPostModes.ALL)}
                className="text-md rounded-md"
              >
                For you
              </TabsTrigger>
            </TabsList>
            <TabsContent value="following">
              <PostFeed
                isHome={true}
                queryFn={getFollowingPosts}
                queryKey="home"
              />
            </TabsContent>

            <TabsContent value="all">
              <PostFeed isHome={true} queryFn={getAllPosts} queryKey="forYou" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Home;
