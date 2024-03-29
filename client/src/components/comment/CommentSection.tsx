import { IComment } from "@/models/comment";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";
import useAuth from "@/hooks/useAuth";

interface CommentSectionProps {
  comments: IComment[];
  postId: string;
  subredditOnwerId: string;
  postAuthor: string;
  postUrl: string;
}

const CommentSection = (props: CommentSectionProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col px-2 md:px-4">
      <CreateComment
        username={user?.username as string}
        postId={props.postId}
        author={props.postAuthor}
        postUrl={props.postUrl}
      />
      <div className="flex flex-col divide-y divide-input">
        {props.comments
          .filter((comment) => comment.replyToId === null)
          .sort((a, b) => b.votes.length - a.votes.length)
          .map((topLevelcomment) => {
            const replyies = props.comments
              .filter((comment) => comment.replyToId === topLevelcomment.id)
              .sort((a, b) => b.votes.length - a.votes.length);

            return (
              <div
                key={topLevelcomment.id}
                className="flex flex-col px-1 md:px-3 py-2"
              >
                <PostComment
                  comment={topLevelcomment}
                  replies={replyies}
                  subredditOnwerId={props.subredditOnwerId}
                  postUrl={props.postUrl}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
