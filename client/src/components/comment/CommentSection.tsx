import { Separator } from "../ui/separator";

import { IComment } from "@/models/comment";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";
import useAuth from "@/hooks/useAuth";

interface CommentSectionProps {
  comments: IComment[];
  postId: string;
  subredditOnwerId: string;
}

const CommentSection = (props: CommentSectionProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col  px-4">
      <Separator className="mb-4" />
      <CreateComment username={user?.name as string} postId={props.postId} />
      <div className="flex flex-col divide-y divide-gray-200">
        {props.comments
          .filter((comment) => comment.replyToId === null)
          .sort((a, b) => b.votes.length - a.votes.length)
          .map((topLevelcomment) => {
            const replyies = props.comments
              .filter((comment) => comment.replyToId === topLevelcomment.id)
              .sort((a, b) => b.votes.length - a.votes.length);

            return (
              <div key={topLevelcomment.id} className="flex flex-col px-3 py-2">
                <PostComment
                  comment={topLevelcomment}
                  replies={replyies}
                  subredditOnwerId={props.subredditOnwerId}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
