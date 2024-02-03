import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Edit, MessageSquare, Trash2 } from "lucide-react";

import SubriddetInfo from "@/components/SubriddetInfo";
import CommentSection from "@/components/comment/CommentSection";
import Vote from "@/components/Vote";
import useSubreddits from "@/hooks/useSubreddits";
import useToken from "@/hooks/useToken";
import ISubreddit from "@/models/subreddit";
import { IExtendedPost } from "@/models/post";
import { formatTimeToNow } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

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
  }, [isLoading, subreddits, postLoading]);

  const { mutate } = useMutation({
    mutationKey: ["deletePost", id],
    mutationFn: async () => {
      toast.loading("Deleting post...");
      await axiosClientAuth.delete(`/post/${id}`);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("post deleted");
      navigator("/");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  const deletePost = () => {
    mutate();
  };

  return (
    <div className="flex-1 bg-muted">
      <MaxWidthWrapper>
        {!postLoading && post && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="hidden md:block md:col-span-1 md:order-last">
              <SubriddetInfo subreddit={subreddit} />
            </div>

            <div className="md:col-span-2 flex flex-col gap-8">
              <div className="rounded-md bg-background shadow pb-3">
                <div className="flex">
                  <Vote postId={post.id} votes={post.votes} />
                  <div className="w-0 flex-1 py-4 pl-3">
                    <div className="max-h-40 mt-1 text-xs text-gray-500 flex justify-between pr-4">
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
                        {user?.id === post.author.id && (
                          <Edit size={18} className="cursor-pointer" />
                        )}
                        {(user?.id === post.author.id ||
                          user?.id === post.subreddit.onwerId) && (
                          <Trash2
                            size={18}
                            className="cursor-pointer"
                            onClick={deletePost}
                          />
                        )}
                      </div>
                    </div>
                    <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
                      {post.title}
                    </h1>
                    <p className="text-muted-foreground mb-3 text-lg mr-2">
                      {post.content}
                    </p>
                    {post.image && (
                      <div className="relative w-full pr-3 flex justify-center">
                        <img src={"http://localhost:3000/post/" + post.image} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm p-2 sm:px-6 flex gap-2 border border-t-gray-200">
                  <MessageSquare />
                  {post.comments.length}
                  <span>Comments</span>
                </div>

                <CommentSection
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
