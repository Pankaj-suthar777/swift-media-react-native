import { Comment } from "@/@types/comment";
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
    queryKey: ["posts", authorId],
    queryFn: () => fetchUserPosts(authorId, page),
  });
};

export const fetchSinglePost = async (id: number) => {
  const client = await getClient();
  const response = await client.get<{ post: Post }>(`/post/${id}`);
  return response.data;
};

export const useFetchSinglePost = (id: number) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchSinglePost(id),
  });
};

export const fetchSinglePostComment = async (id: number) => {
  const client = await getClient();
  const response = await client.get<{ comments: Comment[] }>(
    `/post/comment/${id}`
  );
  return response.data;
};

export const useFetchSinglePostComment = (id: number) => {
  return useQuery({
    queryKey: ["post-comment", id],
    queryFn: () => fetchSinglePostComment(id),
  });
};
