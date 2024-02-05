import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TextareaAutosize from "react-textarea-autosize";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

import { postSchema, TPostSchema } from "@/validators/postSchema";
import { IExtendedPost, IPost } from "@/models/post";
import responseError from "@/models/error";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import useToken from "@/hooks/useToken";

interface UpdateEditorProps {
  subredditName: string;
  postId: string;
  title: string;
  content?: string;
  imageFile?: File | null;
}

const UpdateEditor = (props: UpdateEditorProps) => {
  const [newFile, setNewFile] = useState<null | File>(null);
  const [isImage, setIsImage] = useState(false);
  const navigator = useNavigate();
  const { axiosClientAuth } = useToken();

  useEffect(() => {
    props.imageFile ? setIsImage(true) : setIsImage(false);
  }, [props.imageFile]);

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
      title: props.title,
      content: props.content,
      image: props.imageFile,
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async (post: FormData) => {
      toast.loading("Updating post...");
      const res = await axiosClientAuth.put(`/post/${[props.postId]}`, post, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data as IExtendedPost;
    },
    onSuccess: (data: IPost) => {
      toast.dismiss();
      toast.success("Post updated");
      setTimeout(() => {
        navigator(`/r/${props.subredditName}/post/${data.id}`, {
          replace: true,
        });
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

    // user has selected a new image
    if (newFile) {
      formData.append("image", data.image[0]);
    }

    // user has deleted the image without selecting a new one
    if (!isImage && !newFile) {
      formData.append("image", "");
    }

    formData.append("title", data.title);
    formData.append("content", data.content);
    mutate(formData);
  };

  const onEditorStateChange = (editorState: string) => {
    setValue("content", editorState);
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
        <ReactQuill
          theme="snow"
          onChange={onEditorStateChange}
          defaultValue={props.content}
          className="my-4"
          placeholder="What's on your mind? (optional)"
        />
        <div className="w-fit">
          <Input
            {...register("image", {
              onChange: (event) => {
                setNewFile(event.target.files ? event.target.files[0] : null);
                setIsImage(true);
              },
            })}
            id="picture"
            type="file"
          />
        </div>
        {isImage && (
          <div className="mt-4 relative w-fit">
            <div className="absolute top-0 right-0 m-2 p-1 rounded-full bg-slate-100 flex justify-center ">
              <XCircle
                className="cursor-pointer"
                onClick={() => {
                  setIsImage(false);
                  setNewFile(null);
                  const values = getValues();
                  reset({ ...values, image: "" });
                }}
              />
            </div>
            {newFile ? (
              <img src={URL.createObjectURL(newFile)} />
            ) : (
              props.imageFile && (
                <img
                  src={
                    import.meta.env.VITE_CLOUDINARY_URL + props.imageFile.name
                  }
                />
              )
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateEditor;
