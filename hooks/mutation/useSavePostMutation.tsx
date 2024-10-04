import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useSavePostMutation = ({ id }: { id: number }) => {
  const mutation = useMutation(async () => {
    const client = await getClient();
    const response = await client.post(`/post/save/${id}`);
    return response?.data;
  });

  return mutation;
};

export default useSavePostMutation;
