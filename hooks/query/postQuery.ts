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

export const fetchUserPosts = async (
  authorId: number,
  page: number
): Promise<PostsResponse> => {
  const client = await getClient();
  const response = await client.get<{ posts: Post[] }>(
    `/user/post/${authorId}?page=${page}`
  );
  return response.data;
};

export const useFetchUserPosts = (authorId: number, page: number) => {
  return useQuery({
    queryKey: ["my-posts", authorId],
    queryFn: () => fetchUserPosts(authorId, page),
  });
};
