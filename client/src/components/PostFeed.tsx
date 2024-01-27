import useAuth from "@/hooks/useAuth";
import { IExtendedPost } from "@/models/post";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import Post from "./Post";

interface PostFeedProps {
  posts: IExtendedPost[];
  subredditName: string;
}

const PostFeed = (props: PostFeedProps) => {
  const { axiosClientAuth } = useAuth();
  const lastPostRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => {
      return (await axiosClientAuth.get(`/post?limit=${3}&page=${pageParam}`))
        .data.data;
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: {
      pages: [props.posts],
      pageParams: [1],
    },
    initialPageParam: undefined,
  });

  const posts: IExtendedPost[] =
    data?.pages.flatMap((page) => page) ?? props.posts;
  return (
    <ul className="flex flex-col space-y-6">
      {props.posts &&
        posts.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <div key={post.id} ref={ref}>
                <Post subredditName={props.subredditName} />
              </div>
            );
          } else {
            return <Post subredditName={post.subreddit.name} key={post.id} />;
          }
        })}
    </ul>
  );
};

export default PostFeed;
