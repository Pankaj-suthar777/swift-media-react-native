import { Comment } from "@/@types/comment";
import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useAddReplayCommentMutation = (id: number) => {
  const mutation = useMutation(async ({ text }: { text: string }) => {
    const client = await getClient();
    const response = await client.post<{
      comment: Comment;
      success: boolean;
      message: string;
    }>(`/post/add-replay-comment/${id}`, {
      text,
    });
    return response?.data;
  });

  return mutation;
};

export default useAddReplayCommentMutation;
