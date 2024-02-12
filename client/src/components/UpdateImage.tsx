import { createRef, useState } from "react";
import { Button } from "./ui/button";
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
import { Input } from "./ui/input";

interface InputSchema {
  image: File;
}

const UpdateImage = () => {
  const [open, setOpen] = useState(false);
  const inputFileRef = createRef<HTMLInputElement>();
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  // const formRef = createRef<HTMLFormElement>();
  // console.log(selectedFile);

  const { register, handleSubmit, reset,getValues } = useForm<InputSchema>();

  console.log(getValues());

  const onSubmit = (data: InputSchema) => {
    console.log(data);
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
          <DialogTitle>Update Username</DialogTitle>
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
                  // console.log(event.target.files)
                  setSelectedFile(event.target.files ? event.target.files[0] : null);
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
                    reset({image:""});
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
