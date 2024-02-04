import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

import Editor from "@/components/Editor";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useToken from "@/hooks/useToken";
import { IExtendedPost } from "@/models/post";
import { toast } from "sonner";

const RULES = [
  "1. Remember the human",
  "2. Behave like you would in real life",
  "3. Look for the original source of content",
  "4. Search for duplicates before posting",
  "5. Read the community’s rules",
];

const UpdatePost = () => {
  const { postId } = useParams();
  const { axiosClientAuth } = useToken();
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await axiosClientAuth.get(`/post/${postId}`);
      return res.data.data as IExtendedPost;
    },
  });

  const updatePost = async (post: FormData) => {
    toast.loading("Updating post...");
    const res = await axiosClientAuth.put(`/post/${postId}`, post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data as IExtendedPost;
  };

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="hidden md:block h-fit rounded-lg border border-gray-200 shadow-md md:col-span-1 md:order-last">
            <ul className="flex flex-col p-6 bg-background font-medium">
              <li className="py-3 font-semibold text-lg">Posting to Beddit</li>
              <ol className="divide-y-2 divide-gray-200">
                {RULES.map((rule, index) => (
                  <li key={index} className="py-1">
                    {rule}
                  </li>
                ))}
              </ol>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                  <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900 md:text-2xl">
                    Update Post
                  </h3>
                </div>
              </div>
              <Separator />
              {!isLoading && (
                <Editor
                  title={post?.title}
                  content={post?.content}
                  mutatationFn={updatePost}
                  imageFile={post?.image ? new File([], post.image) : null}
                  subredditId={post?.subreddit.id}
                />
              )}
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  className="w-[200px] text-lg"
                  form="create-post"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default UpdatePost;
