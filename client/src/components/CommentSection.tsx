import { IComment } from "@/models/comment";
import { Separator } from "./ui/separator";
import { VoteType } from "@/models/vote";
import PostComment from "./PostComment";

interface CommentSectionProps {
  comments: IComment[];
}

const CommentSection = (props: CommentSectionProps) => {
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <Separator />
      {/* TODO: CREATE COMMENT */}
      <div className="flex flex-col gap-y-6 mt-4">
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
              <div key={topLevelcomment.id} className="flex flex-col">
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
