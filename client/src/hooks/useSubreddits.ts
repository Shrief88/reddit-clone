import { axiosClient } from "@/api/axios";
import ISubreddit from "@/models/subreddit";
import { useQuery } from "@tanstack/react-query";

const useSubreddits = () => {
  const { data: subreddits, isLoading,isFetching } = useQuery({
    queryKey: ["subreddits"],
    queryFn: async () => {
      const res = await axiosClient.get("/subreddit");
      return res.data.data as ISubreddit[];
    },
  });

  console.log(isLoading , isFetching);
  return { subreddits, isLoading };
};

export default useSubreddits;
