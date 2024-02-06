import { useRef } from "react";
import { NavLink } from "react-router-dom";

import { IExtendedPost } from "@/models/post";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import Vote from "./Vote";
import { Interweave } from "interweave";

interface PostProps {
  post: IExtendedPost;
  isHome: boolean;
}

const Post = ({ post, isHome }: PostProps) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-background shadow">
      <div className="pr-6 flex justify-between">
        <Vote votes={post.votes} postId={post.id} postAuthor={post.author.username}/>
        <div className="w-0 flex-1 py-4 pl-3">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {isHome ? (
              <NavLink
                to={"/r/" + post.subreddit.name}
                className="underline text-sm underline-offset-2 font-bold"
              >
                r/{post.subreddit.name}
              </NavLink>
            ) : null}

            <span className="px-1">•</span>
            <NavLink to={"/u/" + post.author.username}>
              <span>Posted by u/{post.author.username}</span>
            </NavLink>

            <span className="px-2">
              {formatTimeToNow(new Date(post.createdAt))}
            </span>
          </div>

          <NavLink to={"/r/" + post.subreddit?.name + "/post/" + post.id}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </NavLink>

          <div
            className="relative text-sm max-h-72 w-full overflow-clip"
            ref={pRef}
          >
            <NavLink to={"/r/" + post.subreddit?.name + "/post/" + post.id}>
              <Interweave
                content={post.content}
                className="text-muted-foreground"
              />
            </NavLink>

            {post.image && (
              <NavLink to={"/r/" + post.subreddit?.name + "/post/" + post.id}>
                <div className="relative w-full flex justify-center mt-3">
                  <img src={import.meta.env.VITE_CLOUDINARY_URL + post.image} />
                </div>
              </NavLink>
            )}

            {pRef.current?.clientHeight === 288 ? (
              <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="text-sm p-2 sm:px-6 flex gap-2 border border-t-gray-200">
        <NavLink
          to={"/r/" + post.subreddit?.name + "/post/" + post.id}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare />
          {post.comments.length}
          <span>Comments</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Post;
