import useAuth from "@/hooks/useAuth";
import { IExtendedPost } from "@/models/post";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Post from "./Post";

interface PostFeedProps {
  subredditId?: string;
  isHome: boolean;
}

const PostFeed = (props: PostFeedProps) => {
  const { axiosClientAuth } = useAuth();
  const lastPostRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });


  const getPosts = async (page: number) => {
    const res = await axiosClientAuth.get(
      `/post?limit=${3}&page=${page}&subredditId=${props.subredditId}`
    );
    return res.data.data as IExtendedPost[];
  };

  const getSubredditPosts = async (page: number) => {
    const res = await axiosClientAuth.get(
      `/post/subreddits/me?limit=${3}&page=${page}`
    );
    return res.data.data as IExtendedPost[];
  };

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts", props.subredditId || "home"],
    queryFn: async ({
      pageParam = 1,
    }: {
      pageParam: number | undefined;
    }): Promise<IExtendedPost[]> => {
      if (props.isHome) {
        return await getSubredditPosts(pageParam);
      }
      return await getPosts(pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts: IExtendedPost[] =
    data?.pages.flatMap((page) => page) || [];

  return (
    <ul className="flex flex-col space-y-6">
      {posts.length > 0 &&
        posts.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <div key={post.id} ref={ref}>
                <Post post={post} isHome={props.isHome} />
              </div>
            );
          } else {
            return <Post key={post.id} post={post} isHome={props.isHome} />;
          }
        })}
    </ul>
  );
};

export default PostFeed;
