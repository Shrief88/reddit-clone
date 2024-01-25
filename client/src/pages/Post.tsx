import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import useAuth from "@/hooks/useAuth";
import { IPost } from "@/models/post";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Post = () => {
  const { id } = useParams();
  const { axiosClientAuth } = useAuth();

  const { data: post } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const res = await axiosClientAuth.get(`/post/${id}`);
      return res.data.data as IPost;
    },
  });

  return (
    <div className="flex-1 bg-muted">
      <MaxWidthWrapper>post</MaxWidthWrapper>
    </div>
  );
};

export default Post;
