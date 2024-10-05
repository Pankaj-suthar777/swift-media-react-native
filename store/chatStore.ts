import { Chat } from "@/@types/chat";
import { create } from "zustand";

type Store = {
  chats: Chat[] | [];
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
};

export const useChatStore = create<Store>()((set) => ({
  chats: [],
  setChats: (chats) => set(() => ({ chats: chats })),
  addChat: (chat) => set(({ chats }) => ({ chats: [...chats, chat] })),
}));
