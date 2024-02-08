import { useRef, useState } from "react";

import UserAvatar from "../UserAvatar";
import { MessageCircleReply, Trash2, XCircle } from "lucide-react";

import { IComment } from "@/models/comment";
import { formatTimeToNow } from "@/lib/utils";
import CommentVote from "./CommentVote";
import { Button } from "../ui/button";
import CreateComment from "./CreateComment";
import useAuth from "@/hooks/useAuth";
import UpdateComment from "../dialoags/UpdateComment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";
import { toast } from "sonner";

interface PostCommentProps {
  comment: IComment;
  replies: IComment[];
  subredditOnwerId: string;
}

const PostComment = (props: PostCommentProps) => {
  const { user } = useAuth();
  const { axiosClientAuth } = useToken();
  const commentRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteComment", props.comment.id],
    mutationFn: async () => {
      toast.loading("Deleting comment...");
      await axiosClientAuth.delete(`/comment/${props.comment.id}`);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Comment deleted");
      queryClient.invalidateQueries({
        queryKey: ["post", props.comment.postId],
      });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  const handleDelete = () => {
    mutate();
  };

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UserAvatar
            username={props.comment.author.username}
            image={props.comment.author.image}
          />
          <div className="ml-2 flex items-center gap-x-2">
            <p className="text-sm font-medium text-foreground">
              u/{props.comment.author.username}
            </p>
            <p className="max-h-40 truncate text-sm text-muted-foreground">
              {formatTimeToNow(new Date(props.comment.createdAt))}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {user?.id === props.comment.author.id && (
            <UpdateComment
              commentId={props.comment.id}
              postId={props.comment.postId}
              text={props.comment.text}
            />
          )}

          {(user?.id === props.comment.author.id ||
            user?.id === props.subredditOnwerId) && (
            <Trash2
              className="cursor-pointer text-muted-foreground"
              size={18}
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
      <p className="text-sm text-foreground mt-2">{props.comment.text}</p>
      <div className="flex  justify-end items-center">
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
          {!isReplying && (
            <p>{props.replies.length > 0 ? props.replies.length : ""} </p>
          )}
        </Button>
        <CommentVote
          commentId={props.comment.id}
          votes={props.comment.votes}
          commentAuthor={props.comment.author.username}
        />
      </div>
      {isReplying && (
        <CreateComment
          username={user?.username}
          postId={props.comment.postId}
          replyToId={props.comment.id}
          author={props.comment.author.username}
        />
      )}
      {props.replies.length > 0 && isReplying && (
        <div className="ml-2 pl-4 border-l-2 border-input">
          {props.replies.map((reply) => {
            return (
              <PostComment
                key={reply.id}
                comment={reply}
                replies={[]}
                subredditOnwerId={props.subredditOnwerId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostComment;
