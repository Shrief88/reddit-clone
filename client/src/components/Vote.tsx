import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";

import { IPostVote } from "@/models/vote";
import { VoteType } from "@/models/vote";
import useAuth from "@/hooks/useAuth";
import useToken from "@/hooks/useToken";
import { useSocket } from "@/context/Socket";

interface VoteProps {
  votes: IPostVote[];
  postId: string;
  postAuthor: string;
  className?: string;
}

const Vote = (props: VoteProps) => {
  const { user } = useAuth();
  const { axiosClientAuth } = useToken();
  const [isUpvoted, setIsUpVoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);
  const [votesCount, setVotesCount] = useState(0);
  const socket = useSocket();

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
  }, [props.votes, user?.id]);

  const { mutate: upVote } = useMutation({
    mutationKey: ["addUpVote"],
    mutationFn: async () => {
      const res = await axiosClientAuth.post(`/vote/${props.postId}/upvote`);
      return res.data.data;
    },
    onSuccess: () => {
      socket?.emit("notification", user?.username, props.postAuthor,"post_upvote");
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
      const res = await axiosClientAuth.post(`/vote/${props.postId}/downVote`);
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
      await axiosClientAuth.delete(`/vote/${props.postId}`);
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
    <div
      className={cn(
        "flex p-2 gap-1 items-center",
        props.className
      )}
    >
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

export default Vote;
