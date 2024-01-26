import { axiosClient } from "@/api/axios";
import ISubreddit from "@/models/subreddit";
import { useQuery } from "@tanstack/react-query";

const useSubreddits = () => {
  const { data: subreddits } = useQuery({
    queryKey: ["subreddits"],
    queryFn: async () => {
      const res = await axiosClient.get("/subreddit");
      return res.data.data as ISubreddit[];
    },
  });

  return { subreddits };
};

export default useSubreddits;
