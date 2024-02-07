import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import useToken from "@/hooks/useToken";

interface DeletePostProps {
  id: string;
}

const DeletePost = (props: DeletePostProps) => {
  const { axiosClientAuth } = useToken();
  const navigator = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["deletePost", props.id],
    mutationFn: async () => {
      toast.loading("Deleting post...");
      await axiosClientAuth.delete(`/post/${props.id}`);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("post deleted");
      navigator("/");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  const deletePost = () => {
    mutate();
  };

  return <Trash2 size={18} className="cursor-pointer" onClick={deletePost} />;
};

export default DeletePost;
