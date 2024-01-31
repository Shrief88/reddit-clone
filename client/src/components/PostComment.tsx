import { useRef } from "react";

import UserAvatar from "./UserAvatar";

import { IComment } from "@/models/comment";
import { formatTimeToNow } from "@/lib/utils";
import CommentVote from "./CommentVote";

interface PostCommentProps {
  comment: IComment;
  replies: IComment[];
}

const PostComment = (props: PostCommentProps) => {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          username={props.comment.author.name}
          image={props.comment.author.image}
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{props.comment.author.name}
          </p>
          <p className="max-h-40 truncate text-sm text-muted-foreground">
            {formatTimeToNow(new Date(props.comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{props.comment.text}</p>
      <div className="flex gap-2 items-center">
        <CommentVote commentId={props.comment.id} votes={props.comment.votes} />
      </div>
    </div>
  );
};

export default PostComment;
