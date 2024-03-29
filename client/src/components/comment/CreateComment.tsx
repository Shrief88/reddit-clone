import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import TextareaAutosize from "react-textarea-autosize";

import { commentSchema, TCommentSchema } from "@/validators/commentSchema";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useToken from "@/hooks/useToken";
import { IComment } from "@/models/comment";
import responseError from "@/models/error";
import { useSocket } from "@/context/Socket";

interface CreateCommentProps {
  username?: string;
  postId: string;
  replyToId?: string;
  author: string;
  postUrl: string;
}

const CreateComment = (props: CreateCommentProps) => {
  const { axiosClientAuth } = useToken();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["createComment"],
    mutationFn: async (newComment: TCommentSchema) => {
      if (props.replyToId) {
        newComment.replyToId = props.replyToId;
      }
      toast.loading("Creating comment...");
      const res = await axiosClientAuth.post(
        `/comment/${props.postId}`,
        newComment
      );
      return res.data.data as IComment;
    },
    onSuccess: () => {
      if (props.replyToId) {
        socket?.emit(
          "notification",
          props.username,
          props.author,
          "comment_reply",
          props.postUrl,
          props.replyToId
        );
      } else {
        socket?.emit(
          "notification",
          props.username,
          props.author,
          "post_comment",
          props.postUrl,
          props.postId
        );
      }

      toast.dismiss();
      toast.success("Comment created");
      reset({ text: "" });
      queryClient.invalidateQueries({
        queryKey: ["post", props.postId],
      });
    },

    onError: (error: responseError) => {
      toast.dismiss();
      if (error.response.status === 400) {
        toast.error("Bad request , please try again");
      } else {
        toast.error("Something went wrong , please try again");
      }
    },
  });

  const onSubmit = async (data: TCommentSchema) => {
    mutate(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {props.username && (
          <p className="text-sm text-gray-600 mb-2">
            Comment as u/
            <span className="text-blue-800">{props.username}</span>{" "}
          </p>
        )}
        <TextareaAutosize
          {...register("text")}
          placeholder={
            props.replyToId ? "Write a reply ..." : "Write a Comment ..."
          }
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-base md:lg focus:outline-gray-600 rounded-md border border-input p-3 mb-3"
        />
        {errors.text && (
          <span className="text-red-500 text-sm">{errors.text.message}</span>
        )}
        <div className="flex justify-end">
          <Button disabled={isPending} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;
