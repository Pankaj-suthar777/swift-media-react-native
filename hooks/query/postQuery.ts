import { Post } from "@/@types/post";
import { getClient } from "@/api/client";
import { useQuery } from "react-query";

interface PostsResponse {
  posts: Post[];
}

export const fetchPosts = async (page: number): Promise<PostsResponse> => {
  const client = await getClient();
  const response = await client.get(`/post/feed-post?page=${page}`);
  return response.data;
};

export const useGetFeed = (page: number) => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(page),
  });
};
