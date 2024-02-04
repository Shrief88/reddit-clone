import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import useAuth from "@/hooks/useAuth";
import useToken from "@/hooks/useToken";

import { ICommentVote, VoteType } from "@/models/vote";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentVoteProps {
  votes: ICommentVote[];
  commentId: string;
}

const CommentVote = (props: CommentVoteProps) => {
  const { user } = useAuth();
  const { axiosClientAuth } = useToken();
  const [isUpvoted, setIsUpVoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);
  const [votesCount, setVotesCount] = useState(0);

  useEffect(() => {
    let count = 0;
    props.votes.map((vote) => {
      vote.type === VoteType.UPVOTE ? count++ : count--;
      if (vote.userId === user?.id) {
        vote.type === VoteType.UPVOTE
          ? setIsUpVoted(true)
          : setIsDownVoted(true);
      }
    });
    setVotesCount(count);
  }, [props.votes]);

  const { mutate: upVote } = useMutation({
    mutationKey: ["addUpVote"],
    mutationFn: async () => {
      const res = await axiosClientAuth.post(
        `/commentVote/${props.commentId}/upvote`
      );
      return res.data.data;
    },
    onSuccess: () => {
      setIsUpVoted(true);
      if (isDownVoted) {
        setIsDownVoted(false);
        setVotesCount((prev) => prev + 2);
      } else {
        setVotesCount((prev) => prev + 1);
      }
    },
  });

  const { mutate: downVote } = useMutation({
    mutationKey: ["addDownVote"],
    mutationFn: async () => {
      const res = await axiosClientAuth.post(
        `/commentVote/${props.commentId}/downVote`
      );
      return res.data.data;
    },
    onSuccess: () => {
      setIsDownVoted(true);
      if (isUpvoted) {
        setIsUpVoted(false);
        setVotesCount((prev) => prev - 2);
      } else {
        setVotesCount((prev) => prev - 1);
      }
    },
  });

  const { mutate: removeVote } = useMutation({
    mutationKey: ["removeVote"],
    mutationFn: async (type: VoteType) => {
      await axiosClientAuth.delete(`/commentVote/${props.commentId}`);
      return type;
    },
    onSuccess: (type: VoteType) => {
      if (type === VoteType.UPVOTE) {
        setIsUpVoted(false);
        setVotesCount((prev) => prev - 1);
      } else if (type === VoteType.DOWNVOTE) {
        setIsDownVoted(false);
        setVotesCount((prev) => prev + 1);
      }
    },
  });

  const addUpVote = () => {
    if (!isUpvoted) {
      upVote();
    } else {
      removeVote(VoteType.UPVOTE);
    }
  };

  const addDownVote = () => {
    if (!isDownVoted) {
      downVote();
    } else {
      removeVote(VoteType.DOWNVOTE);
    }
  };

  return (
    <div className="flex items-center">
      <ArrowBigUp
        onClick={addUpVote}
        className={cn(
          "cursor-pointer",
          isUpvoted && "fill-red-600 text-red-600"
        )}
      />
      {votesCount}
      <ArrowBigDown
        onClick={addDownVote}
        className={cn(
          "cursor-pointer",
          isDownVoted && "fill-red-600 text-red-600"
        )}
      />
    </div>
  );
};

export default CommentVote;
