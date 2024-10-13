import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useFollowUserMutation = (id: number) => {
  const mutation = useMutation(async () => {
    const client = await getClient();
    const response = await client.post(`/user/follow-user/${id}`);
    return response?.data;
  });

  return mutation;
};

export default useFollowUserMutation;
