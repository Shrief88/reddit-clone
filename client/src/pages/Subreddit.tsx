import { useParams } from "react-router-dom";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import MinicreatePost from "@/components/MinicreatePost";
import PostFeed from "@/components/post/PostFeed";
import SubriddetInfo from "@/components/SubriddetInfo";
import useToken from "@/hooks/useToken";
import ISubreddit from "@/models/subreddit";
import { IExtendedPost } from "@/models/post";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import InfoSkeleton from "@/components/skeleton/InfoSkeleton";

const Subreddit = () => {
  const { subredditName } = useParams();
  const { axiosClientAuth } = useToken();

  const { data: subreddit, isLoading } = useQuery({
    queryKey: ["subreddit", subredditName],
    queryFn: async () => {
      const res = await axiosClientAuth.get(`/subreddit/${subredditName}`);
      return res.data.data as ISubreddit;
    },
  });

  const getPosts = async (page: number) => {
    const res = await axiosClientAuth.get(
      `/post?limit=${3}&page=${page}&subredditId=${subreddit?.id}`
    );
    return res.data.data as IExtendedPost[];
  };

  return (
    <MaxWidthWrapper>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="md:col-span-2">
            {[1, 2, 3].map((i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
          <div className="hidden md:block">
            <InfoSkeleton />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {!isLoading && subreddit && (
          <div className="hidden md:block md:col-span-1 md:order-last">
            <SubriddetInfo subreddit={subreddit} />
          </div>
        )}
        {subreddit && (
          <div className="md:col-span-2 flex flex-col gap-8">
            <MinicreatePost />
            <PostFeed
              isHome={false}
              queryFn={getPosts}
              queryKey={subredditName as string}
            />
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default Subreddit;
