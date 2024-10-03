import { VoteType } from "@/@types/vote";
import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useVotePostMutation = ({ id }: { id: number }) => {
  const mutation = useMutation(async ({ vote }: { vote: VoteType }) => {
    const client = await getClient();
    const response = await client.post(`/post/up-or-down-vote/${id}`, {
      vote,
    });
    return response?.data;
  });

  return mutation;
};

export default useVotePostMutation;
