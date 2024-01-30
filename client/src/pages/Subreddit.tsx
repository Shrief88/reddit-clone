import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import MinicreatePost from "@/components/MinicreatePost";
import useSubreddits from "@/hooks/useSubreddits";
import PostFeed from "@/components/PostFeed";
import ISubreddit from "@/models/subreddit";
import SubriddetInfo from "@/components/SubriddetInfo";

const Subreddit = () => {
  const { subredditName } = useParams();
  const [subreddit, setSubreddit] = useState<ISubreddit | undefined>(undefined);
  const { subreddits, isLoading } = useSubreddits();

  useEffect(() => {
    if (!isLoading) {
      const sub = subreddits?.find((sub) => sub.name === subredditName);
      setSubreddit(sub);
    }
  }, [isLoading, subreddits, subredditName]);

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper>
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="hidden md:block md:col-span-1 md:order-last">
              <SubriddetInfo subreddit={subreddit} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-8">
              <MinicreatePost />
              <PostFeed subredditId={subreddit?.id as string} isHome={false} />
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default Subreddit;
