import { IComment } from "@/models/comment";
import { useRef } from "react";
import UserAvatar from "./UserAvatar";

interface PostCommentProps {
  comment: IComment;
  replies: IComment[];
}

const PostComment = (props: PostCommentProps) => {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        {/* <UserAvatar /> */}
      </div>
    </div>
  );
};

export default PostComment;
