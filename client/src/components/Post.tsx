import { useRef } from "react";
import { NavLink } from "react-router-dom";

import { IExtendedPost } from "@/models/post";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import Vote from "./Vote";

interface PostProps {
  post: IExtendedPost;
  isHome: boolean;
}

const Post = ({ post, isHome }: PostProps) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-background shadow">
      <div className="pr-6 flex justify-between">
        <Vote votes={post.votes} postId={post.id}/>
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
            <span>Posted by u/{post.author.name}</span>
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
            className="relative text-sm max-h-56 w-full overflow-clip"
            ref={pRef}
          >
            <p className="text-muted-foreground mb-3 ">{post.content}</p>

            {post.image && (
              <div className="relative w-full min-h-[15rem]">
                <img src={"http://localhost:3000/post/" + post.image} />
              </div>
            )}

            {pRef.current?.clientHeight === 224 ? (
              <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
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
