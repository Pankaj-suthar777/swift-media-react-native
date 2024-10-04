import { Chat } from "@/@types/chat";
import { getClient } from "@/api/client";
import { useQuery } from "react-query";

export const fetchMyChats = async (): Promise<Chat[]> => {
  const client = await getClient();
  const response = await client.get(`/chat/get-my-chats`);
  return response.data;
};

export const useGetMyChatsQuery = () => {
  return useQuery({
    queryKey: ["my-chats"],
    queryFn: fetchMyChats,
  });
};

interface FetchChatMessageResponse {
  chat_id: number;
  created_at: string;
  id: number;
  senderId: number;
  text: string;
  updated_at: string;
}

export const fetchChatMessage = async (
  chatId: number
): Promise<FetchChatMessageResponse[]> => {
  const client = await getClient();
  const response = await client.get(`/chat/get-chat-messages/${chatId}`);
  return response.data;
};

export const useFetchChatMessageQuery = (chatId: number) => {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatMessage(chatId),
  });
};
