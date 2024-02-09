import { useParams } from "react-router-dom";
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
import Rules from "@/components/Rules";

import Editor from "@/components/Editor";
import useSubreddits from "@/hooks/useSubreddits";

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const { subredditName } = useParams();
  const [value, setValue] = useState(
    subredditName ? subredditName : "Select Subreddit"
  );
  const { subreddits, isLoading } = useSubreddits();

  return (
      <MaxWidthWrapper className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <Rules />
          <div className="md:col-span-2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                  <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-foreground md:text-2xl">
                    Create Post
                  </h3>
                </div>
                {!isLoading && (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="default"
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
                            subreddits?.map((sub) => (
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
              {subreddits && (
                <Editor
                  subredditId={
                    subreddits?.find((sub) => sub.name === value)?.id
                  }
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
  );
};

export default CreatePost;
