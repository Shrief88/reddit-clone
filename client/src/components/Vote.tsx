import { IVote } from "@/models/vote";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { VoteType } from "@/models/vote";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface VoteProps {
  votes: IVote[];
  postId: string;
}

const Vote = (props: VoteProps) => {
  const { user, axiosClientAuth } = useAuth();
  const [isUpvoted, setIsUpVoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);
  const [votesCount, setVotesCount] = useState(0);

  useEffect(() => {
    props.votes.map((vote) => {
      vote.type === VoteType.UPVOTE
        ? setVotesCount((prev) => prev + 1)
        : setVotesCount((prev) => prev - 1);
      if (vote.userId === user?.id) {
        vote.type === VoteType.UPVOTE
          ? setIsUpVoted(true)
          : setIsDownVoted(true);
      }
    });
  }, []);

  const { mutate: upVote } = useMutation({
    mutationKey: ["addUpVote"],
    mutationFn: async () => {
      const res = await axiosClientAuth.post(`/vote/${props.postId}/upvote`);
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

  const addUpVote = () => {
    if (!isUpvoted) {
      upVote();
    }
  };

  const addDownVote = () => {
    if (!isDownVoted) {
      downVote();
    }
  };

  return (
    <div className="flex flex-col z-20 p-3 items-center border-r-blue-100 border-r ">
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
