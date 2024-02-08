import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Interweave } from "interweave";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Edit, MessageSquare } from "lucide-react";

import useSubreddits from "@/hooks/useSubreddits";
import useToken from "@/hooks/useToken";
import useAuth from "@/hooks/useAuth";

import SubriddetInfo from "@/components/SubriddetInfo";
import CommentSection from "@/components/comment/CommentSection";
import Vote from "@/components/Vote";
import DeletePost from "@/components/post/DeletePost";
import SavePost from "@/components/post/SavePost";
import ISubreddit from "@/models/subreddit";
import { IExtendedPost } from "@/models/post";
import { formatTimeToNow } from "@/lib/utils";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import InfoSkeleton from "@/components/skeleton/InfoSkeleton";

const Post = () => {
  const { id } = useParams();
  const { axiosClientAuth } = useToken();
  const { user } = useAuth();
  const [subreddit, setSubreddit] = useState<ISubreddit | undefined>(undefined);
  const { subreddits, isLoading } = useSubreddits();
  const navigator = useNavigate();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await axiosClientAuth.get(`/post/${id}`);
      return res.data.data as IExtendedPost;
    },
  });

  useEffect(() => {
    if (!isLoading && !postLoading) {
      const sub = subreddits?.find((sub) => sub.name === post?.subreddit.name);
      setSubreddit(sub);
    }
  }, [isLoading, subreddits, postLoading, post]);

  return (
    <div className="flex-1 bg-muted">
      <MaxWidthWrapper>
        {postLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="md:col-span-2">
              <PostSkeleton />
            </div>
            <div className="hidden md:block">
              <InfoSkeleton />
            </div>
          </div>
        )}
        {!postLoading && post && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="hidden md:block md:col-span-1 md:order-last">
              <SubriddetInfo subreddit={subreddit} />
            </div>

            <div className="md:col-span-2 flex flex-col gap-8">
              <div className="rounded-md bg-background shadow pb-6">
                <div className="flex">
                  <Vote
                    votes={post.votes}
                    postId={post.id}
                    postAuthor={post.author.username}
                    className="flex-col hidden md:flex border-r border-r-input"
                  />
                  <div className="w-0 flex-1 py-4 pl-3 pr-3">
                    <div className="max-h-40 mt-1 text-xs text-gray-500 flex justify-between">
                      <div className="flex">
                        <span className="px-1">•</span>
                        <NavLink to={"/u/" + post.author.username}>
                          <span>Posted by u/{post.author.username}</span>
                        </NavLink>
                        <span className="px-2">
                          {formatTimeToNow(new Date(post.createdAt))}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <SavePost id={id as string} />
                        {user?.id === post.author.id && (
                          <Edit
                            size={18}
                            className="cursor-pointer"
                            onClick={() =>
                              navigator(`/post/update/r/${post.id}`)
                            }
                          />
                        )}
                        {(user?.id === post.author.id ||
                          user?.id === post.subreddit.onwerId) && (
                          <DeletePost id={id as string} />
                        )}
                      </div>
                    </div>
                    <h1 className="text-xl font-semibold py-2 leading-6 text-foreground">
                      {post.title}
                    </h1>

                    <Interweave
                      content={post.content}
                      className="text-muted-foreground text-lg mr-2"
                    />
                    {post.image && (
                      <div className="relative w-full flex justify-center mt-3">
                        <img
                          src={import.meta.env.VITE_CLOUDINARY_URL + post.image}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm flex items-center gap-2 border-t border-input md:p-3">
                  <Vote
                    votes={post.votes}
                    postId={post.id}
                    postAuthor={post.author.username}
                    className="md:hidden"
                  />

                  <MessageSquare />
                  {post.comments.length}
                  <span>Comments</span>
                </div>

                <CommentSection
                  postAuthor={post.author.username}
                  comments={post.comments}
                  postId={post.id}
                  subredditOnwerId={post.subreddit.onwerId}
                />
              </div>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default Post;
