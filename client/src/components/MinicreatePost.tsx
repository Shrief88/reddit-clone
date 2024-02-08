import { ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import UserAvatar from "./UserAvatar";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const MinicreatePost = () => {
  const navigator = useNavigate();
  const { user } = useAuth();
  let { subredditName } = useParams();
  if (subredditName === undefined) {
    subredditName = "";
  }

  return (
    <div className="overflow-hidden rounded-md bg-background shadow">
      <div className="h-full px-6 py-4 justify-between grid grid-col-1 grid-cols-9 gap-y-3">
        <div className="col-span-8 flex items-center gap-3">
          <UserAvatar username={user?.username} image={user?.image} />
          <Input
            readOnly
            placeholder="Create Post"
            onClick={() => navigator(`/post/create/r/${subredditName}`)}
          />
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => navigator(`/post/create/r/r${subredditName}`)}
          >
            <ImageIcon className="text-zinc-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MinicreatePost;
