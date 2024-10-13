import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useSeenNotificationMutation = () => {
  const mutation = useMutation(async () => {
    const client = await getClient();
    const response = await client.post(`/user/seen-notification`);
    return response?.data;
  });

  return mutation;
};

export default useSeenNotificationMutation;
