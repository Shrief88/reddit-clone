import { useRef, useState } from "react";

import UserAvatar from "../UserAvatar";
import { MessageCircleReply, XCircle } from "lucide-react";

import { IComment } from "@/models/comment";
import { formatTimeToNow } from "@/lib/utils";
import CommentVote from "./CommentVote";
import { Button } from "../ui/button";
import CreateComment from "./CreateComment";
import useAuth from "@/hooks/useAuth";
import UpdateComment from "../dialoags/UpdateComment";

interface PostCommentProps {
  comment: IComment;
  replies: IComment[];
}

const PostComment = (props: PostCommentProps) => {
  const { user } = useAuth();
  const commentRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center">
          {user?.id === props.comment.author.id && (
            <UpdateComment
              commentId={props.comment.id}
              postId={props.comment.postId}
              text={props.comment.text}
            />
          )}
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{props.comment.text}</p>
      <div className="flex gap-2 justify-end items-center">
        <Button
          variant={"ghost"}
          className="flex gap-1"
          onClick={() => setIsReplying((prev) => !prev)}
        >
          {isReplying ? (
            <XCircle size={20} />
          ) : (
            <MessageCircleReply size={20} />
          )}
          <p className="text-bold">{isReplying ? "Cancel" : "Reply"}</p>
          <p>{props.replies.length > 0 ? props.replies.length : ""} </p>
        </Button>
        <CommentVote commentId={props.comment.id} votes={props.comment.votes} />
      </div>
      {isReplying && (
        <CreateComment
          postId={props.comment.postId}
          replyToId={props.comment.id}
        />
      )}
      {props.replies.length > 0 && isReplying && (
        <div className="ml-2 pl-4 border-l-2 border-zinc-200">
          {props.replies.map((reply) => {
            return <PostComment key={reply.id} comment={reply} replies={[]} />;
          })}
        </div>
      )}
    </div>
  );
};

export default PostComment;
