import { Separator } from "./ui/separator";

import { IComment } from "@/models/comment";
import { VoteType } from "@/models/vote";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";
import useAuth from "@/hooks/useAuth";

interface CommentSectionProps {
  comments: IComment[];
  postId: string;
}

const CommentSection = (props: CommentSectionProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <Separator />
      <CreateComment username={user?.name as string} postId={props.postId} />
      <div className="flex flex-col divide-y divide-gray-200">
        {props.comments
          .filter((comment) => comment.replyToId === null)
          .map((topLevelcomment) => {
            let votesCount = 0;
            topLevelcomment.votes.map((vote) => {
              vote.type === VoteType.UPVOTE
                ? (votesCount += 1)
                : (votesCount -= 1);
            });

            const replyies = props.comments.filter(
              (comment) => comment.replyToId === topLevelcomment.id
            );
            return (
              <div key={topLevelcomment.id} className="flex flex-col p-3 mb-1">
                <div className="mb-2">
                  <PostComment comment={topLevelcomment} replies={replyies} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
