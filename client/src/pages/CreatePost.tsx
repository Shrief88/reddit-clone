import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

import ISubreddit from "@/models/subreddit";
import useAuth from "@/hooks/useAuth";
import Editor from "@/components/Editor";

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const { slug } = useParams();
  const [value, setValue] = useState(slug ? slug : "Select Subreddit");
  const { axiosClientAuth } = useAuth();

  const { data: subreddit, isLoading } = useQuery({
    queryKey: ["subreddits"],
    queryFn: async () => {
      const response = await axiosClientAuth.get(`/subreddit/`);
      const data = response.data.data as ISubreddit[];
      return data;
    },
  });

  const RULES = [
    "1. Remember the human",
    "2. Behave like you would in real life",
    "3. Look for the original source of content",
    "4. Search for duplicates before posting",
    "5. Read the community’s rules",
  ];

  return (
    <div className="bg-muted flex-1">
      <MaxWidthWrapper className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="hidden md:block h-fit rounded-lg border border-gray-200 shadow-md md:col-span-1 md:order-last">
            <ul className="flex flex-col p-6 bg-background font-medium">
              <li className="py-3 font-semibold text-lg">Posting to Beddit</li>
              <ol className="divide-y-2 divide-gray-200">
                {RULES.map((rule, index) => (
                  <li key={index} className="py-1">
                    {rule}
                  </li>
                ))}
              </ol>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                  <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900 md:text-2xl">
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
                        {`r/${value}`}
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandEmpty>No subreddit found.</CommandEmpty>
                        <CommandGroup>
                          {!isLoading &&
                            subreddit?.map((sub) => (
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
              {subreddit && (
                <Editor
                  subredditId={subreddit?.find((sub) => sub.slug === value)?.id}
                />
              )}
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  className="w-[200px] text-lg"
                  form="create-post"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default CreatePost;
