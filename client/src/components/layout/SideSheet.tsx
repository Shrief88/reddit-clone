import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useAuth from "@/hooks/useAuth";
import useSubreddits from "@/hooks/useSubreddits";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { buttonVariants } from "../ui/button";

export function SideSheet() {
  const { user } = useAuth();
  const { subreddits } = useSubreddits();

  const [userSubDiv, setUserSubDiv] = useState<JSX.Element[] | null>(null);
  const [otherSubDiv, setOtherSubDiv] = useState<JSX.Element[] | null>(null);

  useEffect(() => {
    if (user && subreddits) {
      const divs = user?.subreddits.map((sub) => {
        const subredditId = sub.subredditId;
        const subreddit = subreddits?.find((sub) => sub.id === subredditId);
        return (
          <NavLink
            to={`r/${subreddit?.slug}`}
            className={buttonVariants({ variant: "link" })}
          >
            {subreddit?.name}
          </NavLink>
        );
      });
      setUserSubDiv(divs);
    }
  }, [subreddits, user]);

  useEffect(() => {
    if (user && subreddits) {
      const otherSubs = subreddits.filter(
        (sub) =>
          !user.subreddits.some((userSub) => userSub.subredditId === sub.id)
      );
      const divs = otherSubs.map((sub) => {
        return (
          <NavLink
            to={`r/${sub?.slug}`}
            className={buttonVariants({ variant: "link" })}
          >
            {sub?.name}
          </NavLink>
        );
      });
      setOtherSubDiv(divs);
    }
  }, [user, subreddits]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex justify-center">
          <Users className="h-5 w-5" />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Subreddits</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">Your subreddits</p>
          {userSubDiv}
        </div>

        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">Other Subreddits</p>
          {otherSubDiv}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SideSheet;
