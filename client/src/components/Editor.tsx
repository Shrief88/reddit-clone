import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  TCreatePostSchema,
} from "@/validators/createPostSchema";

interface EditorProps {
  subredditId: string | undefined;
}

const Editor = (props: EditorProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      subredditId: props.subredditId,
    },
  });

  const onSubmit = async (data: TCreatePostSchema) => {
    console.log("data", data);
  };

  return (
    <div className="w-full p-4 bg-background rounded-lg border border-zinc-200">
      <form
        id="create-post"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextareaAutosize
          {...register("title")}
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-2xl md:5xl font-bold focus:outline-none"
          placeholder="Title"
        />
        {errors.title && (
          <span className="text-red text-sm">{errors.title.message}</span>
        )}
        <TextareaAutosize
          {...register("content")}
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-base md:lg focus:outline-none"
          placeholder="What's on your mind? (optional)"
        />
      </form>
    </div>
  );
};

export default Editor;
