import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import TextareaAutosize from "react-textarea-autosize";

import {
  createCommentSchema,
  TCreateCommentSchema,
} from "@/validators/createCommentSchema";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useToken from "@/hooks/useToken";
import { IComment } from "@/models/comment";
import responseError from "@/models/error";

interface CreateCommentProps {
  username?: string;
  postId: string;
  replyToId?: string;
}

const CreateComment = (props: CreateCommentProps) => {
  const { axiosClientAuth } = useToken();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TCreateCommentSchema>({
    resolver: zodResolver(createCommentSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["createComment"],
    mutationFn: async (newComment: TCreateCommentSchema) => {
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

  const onSubmit = async (data: TCreateCommentSchema) => {
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
          placeholder={props.replyToId ? "Write a reply ..." : "Write a Comment ..."}
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-base md:lg focus:outline-gray-600 rounded-md border boreder-gray p-3 "
        />
        {errors.text && (
          <span className="text-red-500 text-sm">{errors.text.message}</span>
        )}
        <div className="flex justify-end">
          <Button disabled={isPending} type="submit" variant="destructive">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;
