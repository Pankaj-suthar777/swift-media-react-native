import { Comment } from "@/@types/comment";
import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useAddCommentMutation = (id: number) => {
  const mutation = useMutation(async ({ text }: { text: string }) => {
    const client = await getClient();
    const response = await client.post<{
      comment: Comment;
      success: boolean;
      message: string;
    }>(`/post/add-comment/${id}`, {
      text,
    });
    return response?.data;
  });

  return mutation;
};

export default useAddCommentMutation;
