import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

import { commentSchema, TCommentSchema } from "@/validators/commentSchema";
import useToken from "@/hooks/useToken";
import { Edit } from "lucide-react";
import { IComment } from "@/models/comment";
import { useState } from "react";

interface UpdateCommentProps {
  commentId: string;
  postId: string;
  text: string;
}

const UpdateComment = (props: UpdateCommentProps) => {
  const [open, setOpen] = useState(false);

  const { axiosClientAuth } = useToken();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: props.text,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update comment", props.commentId],
    mutationFn: async (updateDate: TCommentSchema) => {
      toast.loading("updating Comment...");
      const response = await axiosClientAuth.put(
        `/comment/${props.commentId}`,
        updateDate
      );
      return response.data.data as IComment;
    },
    onSuccess: () => {
      toast.dismiss();
      setOpen(false);
      toast.success("Comment updated");
      queryClient.invalidateQueries({
        queryKey: ["post", props.postId],
      });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Error updating comment: please try again");
    },
  });

  const onSubmit = async (data: TCommentSchema) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-3 cursor-pointer">
          <Edit size={18} className="text-muted-foreground" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Comment</DialogTitle>
        </DialogHeader>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            id="update-Comment-form"
          >
            <div className="flex gap-4 items-center">
              <TextareaAutosize
                {...register("text")}
                className="w-full resize-none appearance-none overflow-hidden bg-transparent text-base md:lg focus:outline-none"
                placeholder="update comment..."
                id="description"
                minRows={3}
              />
            </div>
            {errors.text && (
              <span className="text-sm text-red-500">
                {errors.text.message}
              </span>
            )}
          </form>
        </div>
        <DialogFooter>
          <Button disabled={isPending} type="submit" form="update-Comment-form">
            Update Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateComment;
