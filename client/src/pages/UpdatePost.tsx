import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

import UpdateEditor from "@/components/UpdateEditor";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useToken from "@/hooks/useToken";
import { IExtendedPost } from "@/models/post";
import Rules from "@/components/Rules";

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

  return (
      <MaxWidthWrapper className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <Rules />
          <div className="md:col-span-2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                  <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-foreground md:text-2xl">
                    Update Post
                  </h3>
                </div>
              </div>
              <Separator />
              {!isLoading && (
                <UpdateEditor
                  title={post?.title as string}
                  content={post?.content}
                  imageFile={post?.image ? new File([], post.image) : null}
                  subredditName={post?.subreddit.name as string}
                  postId={postId as string}
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
  );
};

export default UpdatePost;
