import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import useAuth from "@/hooks/useAuth";
import { IExtendedPost } from "@/models/post";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Vote from "@/components/Vote";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import SubriddetInfo from "@/components/SubriddetInfo";
import { useEffect, useState } from "react";
import useSubreddits from "@/hooks/useSubreddits";
import ISubreddit from "@/models/subreddit";
import CommentSection from "@/components/CommentSection";

const Post = () => {
  const { id } = useParams();
  const { axiosClientAuth } = useAuth();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await axiosClientAuth.get(`/post/${id}`);
      return res.data.data as IExtendedPost;
    },
  });

  const [subreddit, setSubreddit] = useState<ISubreddit | undefined>(undefined);
  const { subreddits, isLoading } = useSubreddits();

  useEffect(() => {
    if (!isLoading && !postLoading) {
      const sub = subreddits?.find((sub) => sub.name === post?.subreddit.name);
      setSubreddit(sub);
    }
  }, [isLoading, subreddits, postLoading]);

  return (
    <div className="flex-1 bg-muted">
      <MaxWidthWrapper>
        {!postLoading && post && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="hidden md:block md:col-span-1 md:order-last">
              <SubriddetInfo subreddit={subreddit} />
            </div>

            <div className="md:col-span-2 flex flex-col gap-8">
              <div className="rounded-md bg-background shadow">
                <div className="flex">
                  <Vote postId={post.id} votes={post.votes} />
                  <div className="w-0 flex-1 py-4 pl-3">
                    <div className="max-h-40 mt-1 text-xs text-gray-500">
                      <span className="px-1">•</span>
                      <span>Posted by u/{post.author.name}</span>
                      <span className="px-2">
                        {formatTimeToNow(new Date(post.createdAt))}
                      </span>
                    </div>
                    <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
                      {post.title}
                    </h1>
                    <p className="text-muted-foreground mb-3 text-lg">
                      {post.content}
                    </p>
                    {post.image && (
                      <div className="relative w-full">
                        <img src={"http://localhost:3000/post/" + post.image} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6 flex gap-2">
                  <MessageSquare />
                  {post.comments.length}
                  <span>Comments</span>
                </div>

                <CommentSection comments={post.comments} />
              </div>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default Post;
