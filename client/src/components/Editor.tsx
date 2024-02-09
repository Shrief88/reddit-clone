import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TextareaAutosize from "react-textarea-autosize";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

import { postSchema, TPostSchema } from "@/validators/postSchema";
import { IExtendedPost, IPost } from "@/models/post";
import responseError from "@/models/error";
import useSubreddits from "@/hooks/useSubreddits";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import useToken from "@/hooks/useToken";

interface EditorProps {
  subredditId?: string;
}

const Editor = (props: EditorProps) => {
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const navigator = useNavigate();
  const { subreddits } = useSubreddits();
  const { axiosClientAuth } = useToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<TPostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (post: FormData) => {
      toast.loading("Creating post...");
      const res = await axiosClientAuth.post(`/post/`, post, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data as IExtendedPost;
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

  const onSubmit = async (data: TPostSchema) => {
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
      mutate(formData);
    }
  };

  const onEditorStateChange = (editorState: string) => {
    setValue("content", editorState);
  };

  return (
    <div className="w-full p-4 bg-card rounded-lg border border-border">
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
        <ReactQuill
          theme="snow"
          onChange={onEditorStateChange}
          className="my-4 placeholder-red"
          placeholder="What's on your mind? (optional)"
        />
        <div className="w-fit">
          <Input
            {...register("image", {
              onChange: (event) =>
                setSelectedFile(
                  event.target.files ? event.target.files[0] : null
                ),
            })}
            className="file:text-foreground bg-card"
            id="picture"
            type="file"
          />
        </div>
        {selectedFile && (
          <div className="mt-4 relative w-fit">
            <div className="absolute top-0 right-0 m-2 p-0.5 rounded-full bg-card flex justify-center  ">
              <XCircle
                className="cursor-pointer"
                onClick={() => {
                  setSelectedFile(null);
                  const values = getValues();
                  reset({ ...values, image: "" });
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
