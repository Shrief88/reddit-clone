import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

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

import {
  createCommunitySchema,
  TCreateCommunitySchema,
} from "@/validators/createCommunitySchema";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

const CreateCommunity = () => {
  const { axiosClinetWithToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateCommunitySchema>({
    resolver: zodResolver(createCommunitySchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (newCommunity: TCreateCommunitySchema) => {
      toast.loading("Creating community...");
      return await axiosClinetWithToken.post("/subriddit", newCommunity);
    },
  });

  const onSubmit = async (data: TCreateCommunitySchema) => {
    mutate(data);
    // TODO: Add error handling
    toast.success("Community created");
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
            <DialogFooter>
              <Button disabled={isPending} type="submit">Create Community</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunity;
