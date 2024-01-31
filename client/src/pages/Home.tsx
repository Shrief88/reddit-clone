import { NavLink } from "react-router-dom";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

import { IExtendedPost } from "@/models/post";
import CreateCommunity from "@/components/dialoags/CreateCommunity";
import MinicreatePost from "@/components/MinicreatePost";
import PostFeed from "@/components/PostFeed";
import useToken from "@/hooks/useToken";


const Home = () => {
  const { axiosClientAuth } = useToken();
  const getSubredditPosts = async (page: number) => {
    const res = await axiosClientAuth.get(
      `/post/subreddits/me?limit=${3}&page=${page}`
    );
    return res.data.data as IExtendedPost[];
  };

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-10">
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
              <CreateCommunity />
              <NavLink
                className={buttonVariants({ variant: "secondary" })}
                to={"/post/create/r/"}
              >
                Create Post
              </NavLink>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-8">
            <MinicreatePost />
            <PostFeed
              isHome={true}
              queryFn={getSubredditPosts}
              queryKey="home"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Home;
