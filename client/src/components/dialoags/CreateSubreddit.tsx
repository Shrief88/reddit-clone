import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  createSubredditSchema,
  TcreateSubredditSchema,
} from "@/validators/createSubredditSchema";
import useToken from "@/hooks/useToken";
import responseError from "@/models/error";
import ISubreddit from "@/models/subreddit";

const CreateSubreddit = () => {
  const { axiosClientAuth } = useToken();
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TcreateSubredditSchema>({
    resolver: zodResolver(createSubredditSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["createSubreddit"],
    mutationFn: async (newSubreddit: TcreateSubredditSchema) => {
      toast.loading("Creating Subreddit...");
      const response = await axiosClientAuth.post("/subreddit", newSubreddit);
      return response.data.data as ISubreddit;
    },
    onSuccess: (data) => {
      toast.dismiss();
      navigator(`/r/${data.name}`, { replace: true });
    },
    onError: (error: responseError) => {
      toast.dismiss();
      if (error.response.status === 409) {
        toast.error("Subreddit already exists");
      } else if (error.response.status === 403) {
        toast.error("Please login with ypur google account to have access to this feature");
      } else {
        toast.error("Error while creating subreddit, please try again");
      }
    },
  });

  const onSubmit = async (data: TcreateSubredditSchema) => {
    mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Subreddit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Subreddit</DialogTitle>
          <DialogDescription>
            Subreddit names including capitalization cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-sm text-muted-foreground pb-2">
            Subreddit name must start with r/
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            id="create-Subreddit-form"
          >
            <div className="flex gap-4 items-center">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name")}
                className={cn({
                  "focus-visible:ring": errors.name,
                })}
                id="name"
                type="text"
                defaultValue="r/"
              ></Input>
            </div>
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
            <div className="flex gap-4 items-center">
              <textarea
                id="description"
                placeholder="Add a description"
                {...register("description")}
                className={cn(
                  {
                    "focus-visible:ring-red-500": errors.description,
                  },
                  "w-full border-input border rounded-md p-3 bg-background "
                )}
              ></textarea>
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
            form="create-Subreddit-form"
          >
            Create Subreddit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubreddit;
