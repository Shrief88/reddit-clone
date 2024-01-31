import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import MinicreatePost from "@/components/MinicreatePost";
import PostFeed from "@/components/PostFeed";
import SubriddetInfo from "@/components/SubriddetInfo";
import useSubreddits from "@/hooks/useSubreddits";
import useToken from "@/hooks/useToken";
import ISubreddit from "@/models/subreddit";
import { IExtendedPost } from "@/models/post";

const Subreddit = () => {
  const { subredditName } = useParams();
  const [subreddit, setSubreddit] = useState<ISubreddit | undefined>(undefined);
  const { subreddits, isLoading } = useSubreddits();
  const { axiosClientAuth } = useToken();
  useEffect(() => {
    if (!isLoading) {
      const sub = subreddits?.find((sub) => sub.name === subredditName);
      setSubreddit(sub);
    }
  }, [isLoading, subreddits, subredditName]);

  const getPosts = async (page: number) => {
    const res = await axiosClientAuth.get(
      `/post?limit=${3}&page=${page}&subredditId=${subreddit?.id}`
    );
    return res.data.data as IExtendedPost[];
  };

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper>
        {!isLoading && subreddit && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="hidden md:block md:col-span-1 md:order-last">
              <SubriddetInfo subreddit={subreddit} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-8">
              <MinicreatePost />
              <PostFeed
                isHome={false}
                queryFn={getPosts}
                queryKey={subreddit.name}
              />
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default Subreddit;
