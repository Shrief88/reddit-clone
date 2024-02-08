import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Bookmark, BookmarkCheck } from "lucide-react";

import useToken from "@/hooks/useToken";
import responseError from "@/models/error";
import useAuth from "@/hooks/useAuth";

interface SavePostProps {
  id: string;
}

const SavePost = (props: SavePostProps) => {
  const { axiosClientAuth } = useToken();
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.savedPosts.some((post) => post.postId === props.id)) {
      setIsSaved(true);
    }
  }, [user, props.id]);

  const { mutate: savePost } = useMutation({
    mutationKey: ["savePost", props.id],
    mutationFn: async () => {
      await axiosClientAuth.post(`savedPost/${props.id}`);
    },
    onSuccess: () => {
      toast.success("Post saved");
      setIsSaved(true);
    },
    onError: (err: responseError) => {
      if (err.response.status === 409) {
        toast.error("Already saved");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const { mutate: unSavePost } = useMutation({
    mutationKey: ["unSavePost", props.id],
    mutationFn: async () => {
      await axiosClientAuth.delete(`savedPost/${props.id}`);
    },
    onSuccess: () => {
      toast.success("Post unsaved");
      setIsSaved(false);
    },
    onError: (err: responseError) => {
      if (err.response.status === 409) {
        toast.error("Already unsaved");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleSaving = () => {
    isSaved ? unSavePost() : savePost();
  };

  return isSaved ? (
    <BookmarkCheck
      size={18}
      className="cursor-pointer"
      onClick={handleSaving}
    />
  ) : (
    <Bookmark size={18} className="cursor-pointer" onClick={handleSaving} />
  );
};

export default SavePost;
