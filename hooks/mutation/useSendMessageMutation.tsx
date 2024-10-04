import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useSendMessageMutation = (receiverId: number) => {
  const mutation = useMutation(async ({ text }: { text: string }) => {
    const client = await getClient();
    const response = await client.post(`/chat/send-message`, {
      message: text,
      receiverId,
    });
    return response?.data;
  });

  return mutation;
};

export default useSendMessageMutation;
