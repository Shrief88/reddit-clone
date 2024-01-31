import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TextareaAutosize from "react-textarea-autosize";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

import {
  createPostSchema,
  TCreatePostSchema,
} from "@/validators/createPostSchema";
import useToken from "@/hooks/useToken";
import { IPost } from "@/models/post";
import responseError from "@/models/error";
import useSubreddits from "@/hooks/useSubreddits";

interface EditorProps {
  subredditId: string | undefined;
}

const Editor = (props: EditorProps) => {
  const { axiosClientAuth } = useToken();
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const navigator = useNavigate();
  const { subreddits } = useSubreddits();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TCreatePostSchema>({
    resolver: zodResolver(createPostSchema),
  });

  const { mutate } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (newPost: FormData) => {
      toast.loading("Creating post...");
      const res = await axiosClientAuth.post("/post", newPost, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data as IPost;
    },
    onSuccess: (data: IPost) => {
      toast.dismiss();
      toast.success("Post created");
      const subredditName = subreddits?.find(
        (sub) => sub.id === data.subredditId
      )?.name;
      setTimeout(() => {
        navigator(`/r/${subredditName}/post/${data.id}`, { replace: true });
      }, 1000);
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

  const onSubmit = async (data: TCreatePostSchema) => {
    const formData = new FormData();
    if (data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    formData.append("title", data.title);
    formData.append("content", data.content);

    if (!props.subredditId) {
      toast.error("Please select a subreddit");
    } else {
      formData.append("subredditId", props.subredditId);
      toast.loading("Creating post...");
      mutate(formData);
    }
  };

  return (
    <div className="w-full p-4 bg-background rounded-lg border border-zinc-200">
      <form
        id="create-post"
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextareaAutosize
          {...register("title")}
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-2xl md:5xl font-bold focus:outline-none"
          placeholder="Title"
        />
        {errors.title && (
          <span className="text-red-500 text-sm">{errors.title.message}</span>
        )}
        <TextareaAutosize
          {...register("content")}
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-base md:lg focus:outline-none"
          placeholder="What's on your mind? (optional)"
          id="content"
        />
        <div className="w-fit mt-10">
          <Input
            {...register("image", {
              onChange: (event) =>
                setSelectedFile(
                  event.target.files ? event.target.files[0] : null
                ),
            })}
            id="picture"
            type="file"
          />
        </div>
        {selectedFile && (
          <div className="mt-4 relative w-fit">
            <div className="absolute top-0 right-0 m-2 p-1 rounded-full bg-slate-100 flex justify-center ">
              <XCircle
                className="cursor-pointer"
                onClick={() => {
                  setSelectedFile(null);
                  reset({ image: "" });
                }}
              />
            </div>

            <img src={URL.createObjectURL(selectedFile)} />
          </div>
        )}
      </form>
    </div>
  );
};

export default Editor;
