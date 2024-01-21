import { ImageIcon, Link2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import UserAvatar from "./UserAvatar";
import { useNavigate, useParams } from "react-router-dom";

const MinicreatePost = () => {
  const navigator = useNavigate();
  let { slug } = useParams();
  if (slug === undefined) {
    slug = "";
  }

  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 justify-between grid grid-col-1 md:grid-cols-6 gap-y-3">
        <div className="col-span-5 flex items-center gap-3">
          <UserAvatar />
          <Input
            readOnly
            placeholder="Create Post"
            onClick={() => navigator(`/post/create/r/${slug}`)}
          ></Input>
        </div>

        <div>
          <Button
            variant="ghost"
            onClick={() => navigator(`/post/create/r/${slug}`)}
          >
            <ImageIcon className="text-zinc-600" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigator(`/post/create/r/${slug}`)}
          >
            <Link2 className="text-zinc-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MinicreatePost;
