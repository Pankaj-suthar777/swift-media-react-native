import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useCreatePostMutation = () => {
  const mutation = useMutation(async (data: Object) => {
    const client = await getClient();
    const response = await client.post(`/post/new`, data);
    return response?.data;
  });

  return mutation;
};

export default useCreatePostMutation;
