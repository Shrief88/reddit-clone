import { NavLink } from "react-router-dom";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import CreateCommunity from "@/components/dialoags/CreateCommunity";
import MinicreatePost from "@/components/MinicreatePost";

const Home = () => {
  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="h-fit rounded-lg border border-gray-200 shadow-md md:col-span-1 md:order-last">
            <div className="bg-emerald-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <HomeIcon />
                <p className="font-semibold text-3xl">Home</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-6 py-6 bg-background ">
              <div className="flex justify-between py-2">
                <p className="text-sm text-muted-foreground text-center">
                  Your personal Reddit frontpage. Come here to check in with
                  your favorite communities.
                </p>
              </div>
              <CreateCommunity />
              <NavLink
                className={buttonVariants({ className: "w-full text-lg " })}
                to={"/post/create"}
              >
                Create Post
              </NavLink>
            </div>
          </div>
          {/* TODO: ADD Timeline  */}
          <div className="md:col-span-2">
            <MinicreatePost />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Home;
