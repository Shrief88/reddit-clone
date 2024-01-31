import { useEffect, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "./ui/command";
import useSubreddits from "@/hooks/useSubreddits";
import ISubreddit from "@/models/subreddit";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const navigator = useNavigate();
  const { subreddits } = useSubreddits();
  const [filteredSubreddits, setFilteredSubreddits] = useState<ISubreddit[]>(
    []
  );

  useEffect(() => {
    if (subreddits && input.length > 0) {
      setFilteredSubreddits(
        subreddits.filter((subreddit) =>
          subreddit.name.toLowerCase().includes(input.toLowerCase())
        )
      );
    }
  }, [input, subreddits]);

  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        value={input}
        onValueChange={(value) => setInput(value)}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search Subreddits..."
      />

      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {filteredSubreddits.length === 0 ? (
            <CommandEmpty>No results found</CommandEmpty>
          ) : (
            <div>
              <CommandGroup heading="Subreddits">
                {filteredSubreddits.map((subreddit) => (
                  <CommandItem
                    key={subreddit.id}
                    value={subreddit.name}
                    onSelect={() => {
                      navigator(`/r/${subreddit.name}`, { replace: true });
                      setInput("");
                      setFilteredSubreddits([]);
                    }}
                  >
                    r/{subreddit.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
