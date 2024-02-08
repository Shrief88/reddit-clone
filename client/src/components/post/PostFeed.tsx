import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { IExtendedPost } from "@/models/post";
import Post from "./Post";
import PostSkeleton from "../skeleton/PostSkeleton";

interface PostFeedProps {
  isHome: boolean;
  queryKey: string;
  queryFn: (page: number) => Promise<IExtendedPost[]>;
}

const PostFeed = (props: PostFeedProps) => {
  const lastPostRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["posts", props.queryKey],
    queryFn: async ({
      pageParam = 1,
    }: {
      pageParam: number | undefined;
    }): Promise<IExtendedPost[]> => {
      return await props.queryFn(pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts: IExtendedPost[] = data?.pages.flatMap((page) => page) || [];

  return (
    <ul className="flex flex-col space-y-6">
      {isLoading && [1, 2, 3].map((i) => <PostSkeleton key={i} />)}
      {posts.length > 0 ? (
        posts.map((post, index) => {
          // I added posts.length > 1 to fix bug with last post when there is only 1 post
          if (index === posts.length - 1 && posts.length > 1) {
            return (
              <div key={post.id} ref={ref}>
                <Post post={post} isHome={props.isHome} />
              </div>
            );
          } else {
            return <Post key={post.id} post={post} isHome={props.isHome} />;
          }
        })
      ) : (
        <div className="flex justify-center">
          <p className="text-muted-foreground pt-4">No posts to show</p>
        </div>
      )}
    </ul>
  );
};

export default PostFeed;
