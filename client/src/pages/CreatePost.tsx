import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import ISubreddit from "@/models/subreddit";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";

import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const { slug } = useParams();
  const [value, setValue] = useState(slug ? `r/${slug}` : "Select Subreddit");

  const { axiosClientAuth } = useAuth();

  const { data: subreddit, isLoading } = useQuery({
    queryKey: ["subreddit"],
    queryFn: async () => {
      const response = await axiosClientAuth.get(`/subreddit/`);
      const data = response.data.data as ISubreddit[];
      return data;
    },
  });

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="hidden md:block h-fit rounded-lg border border-gray-200 shadow-md md:col-span-1 md:order-last">
            <ul className="flex flex-col p-6 bg-background divide-y-2 divide-gray-200 font-medium">
              <li className="py-3">Posting to Beddit</li>
              <li className="p-1 text-base">1. Remember the human</li>
              <li className="p-1">2. Behave like you would in real life</li>
              <li className="p-1">
                3. Look for the original source of content
              </li>
              <li className="p-1">4. Search for duplicates before posting</li>
              <li className="p-1">5. Read the community’s rules</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                  <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
                    Create Post
                  </h3>
                </div>
                {!isLoading && (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[200px] justify-between text-sm"
                      >
                        {value}
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandEmpty>No subreddit found.</CommandEmpty>
                        <CommandGroup>
                          {subreddit?.map((sub) => (
                            <CommandItem
                              key={sub.id}
                              onSelect={() => {
                                setValue(sub.name);
                                setOpen(false);
                              }}
                            >
                              r/{sub.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <Separator />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default CreatePost;
