import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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

import {
  updateSubredditSchema,
  TUpdateSubredditSchema,
} from "@/validators/updateSubredditSchema";
import useToken from "@/hooks/useToken";
import ISubreddit from "@/models/subreddit";
import { Edit } from "lucide-react";

interface UpdateSubredditProps {
  subredditId: string;
}

const UpdateSubreddit = (props: UpdateSubredditProps) => {
  const { axiosClientAuth } = useToken();
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUpdateSubredditSchema>({
    resolver: zodResolver(updateSubredditSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateSubreddit"],
    mutationFn: async (updateDate: TUpdateSubredditSchema) => {
      toast.loading("updating Subreddit...");
      const response = await axiosClientAuth.put(
        `/subreddit/${props.subredditId}`,
        updateDate
      );
      return response.data.data as ISubreddit;
    },
    onSuccess: () => {
      toast.dismiss();
      navigator(0);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Error updating Subreddit: please try again");
    },
  });

  const onSubmit = async (data: TUpdateSubredditSchema) => {
    mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-3 cursor-pointer">
          <Edit size={20} />
          <p className="text-muted-foreground">Edit Description</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Subreddit</DialogTitle>
        </DialogHeader>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            id="update-Subreddit-form"
          >
            <div className="flex gap-4 items-center">
              <TextareaAutosize
                {...register("description")}
                className="w-full resize-none appearance-none overflow-hidden bg-transparent text-base md:lg focus:outline-none"
                placeholder="write a new description..."
                id="description"
                minRows={3}
              />
            </div>
            {errors.description && (
              <span className="text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </form>
        </div>
        <DialogFooter>
          <Button
            disabled={isPending}
            type="submit"
            form="update-Subreddit-form"
          >
            Update Subreddit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSubreddit;
