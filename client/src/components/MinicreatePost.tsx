import { ImageIcon, Link2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import UserAvatar from "./UserAvatar";


const MinicreatePost = () => {
  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 justify-between grid grid-col-1 md:grid-cols-6 gap-y-3">
        <div className="col-span-5 flex items-center gap-3">
          <UserAvatar />
          <Input readOnly placeholder="Create Post"></Input>
        </div>

        <div>
          <Button variant="ghost">
            <ImageIcon className="text-zinc-600" />
          </Button>
          <Button variant="ghost">
            <Link2 className="text-zinc-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MinicreatePost;
