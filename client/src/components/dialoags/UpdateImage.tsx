import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useToken from "@/hooks/useToken";
import { useNavigate } from "react-router-dom";
import responseError from "@/models/error";

interface InputSchema {
  image: File;
}

const UpdateImage = () => {
  const [open, setOpen] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const { axiosClientAuth } = useToken();
  const navigator = useNavigate();

  const { register, handleSubmit, reset, setValue } = useForm<InputSchema>();

  const { mutate } = useMutation({
    mutationKey: ["updateImage"],
    mutationFn: async (data: InputSchema) => {
      toast.loading("Updating image...");
      await axiosClientAuth.put(`/users/me/image`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Image updated");
      navigator(0);
    },
    onError: (err: responseError) => {
      toast.dismiss();
      if (err.response.status === 403) {
        toast.error("Please login with ypur google account to have access to this feature");
      } else {
        toast.error("Something went wrong , please try again");
      }
    },
  });

  const onSubmit = (data: InputSchema) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-3 cursor-pointer">
          <Button variant="outline" className="w-full" type="button">
            Update Image
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Image</DialogTitle>
        </DialogHeader>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            id="update-image-form"
          >
            {!selectedFile && (
              <Button
                onClick={() => inputFileRef.current?.click()}
                type="button"
              >
                Uplaod an Image
              </Button>
            )}

            <Input
              {...register("image", {
                onChange: (event) => {
                  setValue("image", event.target.files[0]);
                  setSelectedFile(
                    event.target.files ? event.target.files[0] : null
                  );
                },
              })}
              className="hidden"
              id="image"
              type="file"
              ref={inputFileRef}
            />
          </form>
        </div>
        <DialogFooter>
          {selectedFile && (
            <div className="relative w-fit">
              <div className="absolute top-0 right-0 m-2 p-0.5 rounded-full bg-card flex justify-center  ">
                <XCircle
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedFile(null);
                    inputFileRef.current && (inputFileRef.current.value = "");
                    reset();
                  }}
                />
              </div>

              <img src={URL.createObjectURL(selectedFile)} />
              <Button type="submit" form="update-image-form" className="mt-4">
                Update Image
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateImage;
