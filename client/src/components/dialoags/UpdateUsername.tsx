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

import {
  updateUsernameSchema,
  TUpdateUsernameSchema,
} from "@/validators/updateUsernameSchema";
import useToken from "@/hooks/useToken";
import { IComment } from "@/models/comment";
import { useState } from "react";
import responseError from "@/models/error";
import { useNavigate } from "react-router-dom";
import IUser from "@/models/user";

interface UpdateUsernameProps {
  username: string;
}

const UpdateUsername = (props: UpdateUsernameProps) => {
  const [open, setOpen] = useState(false);
  const navigator = useNavigate();
  const { axiosClientAuth } = useToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUpdateUsernameSchema>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: props.username,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update username", props.username],
    mutationFn: async (updateDate: TUpdateUsernameSchema) => {
      toast.loading("updating username...");
      const response = await axiosClientAuth.put(
        `/users/me/username`,
        updateDate
      );
      return response.data.user as IUser;
    },
    onSuccess: (data: IUser) => {
      toast.dismiss();
      setOpen(false);
      toast.success("username updated");
      navigator(`/u/${data.username}`, { replace: true });
    },

    onError: (err: responseError) => {
      toast.dismiss();
      if (err.response.status === 409) {
        toast.error("Username already exists");
      } else {
        toast.error("Error updating username: please try again");
      }
    },
  });

  const onSubmit = async (data: TUpdateUsernameSchema) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-3 cursor-pointer">
          <Button variant="outline" className="w-full">
            Update username
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Username</DialogTitle>
        </DialogHeader>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            id="update-username-form"
          >
            <div className="flex gap-4 items-center">
              <TextareaAutosize
                {...register("username")}
                className="w-full resize-none appearance-none overflow-hidden bg-transparent text-base md:lg focus:outline-none"
                placeholder="update username..."
                id="description"
              />
            </div>
            {errors.username && (
              <span className="text-sm text-red-500">
                {errors.username.message}
              </span>
            )}
          </form>
        </div>
        <DialogFooter>
          <Button
            disabled={isPending}
            type="submit"
            form="update-username-form"
          >
            Update Username
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUsername;
