import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  createCommunitySchema,
  TCreateCommunitySchema,
} from "@/validators/createCommunitySchema";
import useAuth from "@/hooks/useAuth";
import responseError from "@/models/error";
import ISubreddit from "@/models/subreddit";

const CreateCommunity = () => {
  const { axiosClientAuth } = useAuth();
  const queryClient = useQueryClient();
  const navigator = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateCommunitySchema>({
    resolver: zodResolver(createCommunitySchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["createCommunity"],
    mutationFn: async (newCommunity: TCreateCommunitySchema) => {
      console.log(newCommunity);
      toast.loading("Creating community...");
      const response = await axiosClientAuth.post("/subreddit", newCommunity);
      return response.data.data as ISubreddit;
    },
    onSuccess: (data) => {
      toast.dismiss();
      queryClient.invalidateQueries({
        queryKey: ["subreddits"],
        refetchType: "all",
      });
      navigator(`/r/${data.name}`, { replace: true });
    },
    onError: (error: responseError) => {
      toast.dismiss();
      if (error.response.status === 409) {
        toast.error("Community already exists");
      } else {
        toast.error("Error creating community: please try again");
      }
    },
  });

  const onSubmit = async (data: TCreateCommunitySchema) => {
    mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Community</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Community</DialogTitle>
          <DialogDescription>
            Community names including capitalization cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-sm text-muted-foreground pb-2">
            Community name must start with r/
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            id="create-community-form"
          >
            <div className="flex gap-4 items-center">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name")}
                className={cn({
                  "focus-visible:ring-red-500": errors.name,
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
                  "w-full border-input border rounded-md p-3"
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
            form="create-community-form"
          >
            Create Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunity;
