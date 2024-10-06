import { Chat } from "@/@types/chat";
import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useSendMessageMutation = (receiverId: number) => {
  const mutation = useMutation(
    async ({ text, imageUrl }: { text: string; imageUrl?: string }) => {
      const client = await getClient();
      const response = await client.post<{ chat: Chat }>(`/chat/send-message`, {
        message: text,
        receiverId,
        imageUrl,
      });
      return response?.data;
    }
  );

  return mutation;
};

export default useSendMessageMutation;
