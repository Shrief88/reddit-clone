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
import { Button, buttonVariants } from "../ui/button";

export function SideSheet() {
  const { user } = useAuth();
  const { subreddits } = useSubreddits();
  const [userSubDiv, setUserSubDiv] = useState<JSX.Element[] | null>(null);
  const [otherSubDiv, setOtherSubDiv] = useState<JSX.Element[] | null>(null);

  useEffect(() => {
    if (user && subreddits) {
      const userSubreddits = subreddits.filter((sub) =>
        sub.subscribers.some((sub) => sub.userId === user?.id)
      );
      const divs = userSubreddits.map((sub) => {
        return (
          <NavLink
            key={sub.id}
            to={`r/${sub?.name}`}
            className={buttonVariants({ variant: "ghost" })}
          >
            r/{sub?.name}
          </NavLink>
        );
      });
      setUserSubDiv(divs);
    }
  }, [subreddits, user]);

  useEffect(() => {
    if (user && subreddits) {
      const otherSubs = subreddits.filter(
        (sub) => !sub.subscribers.some((sub) => sub.userId === user?.id)
      );
      const divs = otherSubs.map((sub) => {
        return (
          <NavLink
            key={sub.id}
            to={`r/${sub.name}`}
            className={buttonVariants({ variant: "ghost" })}
          >
            r/{sub?.name}
          </NavLink>
        );
      });
      setOtherSubDiv(divs);
    }
  }, [user, subreddits]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Users className="h-5 w-5 cursor-pointer" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Subreddits</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          {userSubDiv && userSubDiv.length > 0 && (
            <div className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground">Your subreddits</p>
              {userSubDiv}
            </div>
          )}

          <div className="flex flex-col items-start">
            <p className="text-sm text-muted-foreground">Other Subreddits</p>
            {otherSubDiv}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SideSheet;
