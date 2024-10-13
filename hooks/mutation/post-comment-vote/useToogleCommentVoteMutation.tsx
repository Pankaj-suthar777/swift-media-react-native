import { getClient } from "@/api/client";
import { useMutation } from "react-query";
import { VoteType } from "@/@types/vote";

const useToogleCommentVoteMutation = (id: number) => {
  const mutation = useMutation(async ({ vote }: { vote: VoteType }) => {
    const client = await getClient();
    const response = await client.post(`/post/toggle-comment-vote/${id}`, {
      vote,
    });
    return response?.data;
  });

  return mutation;
};

export default useToogleCommentVoteMutation;
