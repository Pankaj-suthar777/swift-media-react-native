import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import UserChat from "@/components/chat/UserChat";
import { useGetMyChatsQuery } from "@/hooks/query/chatQuery";
import { useAuthStore } from "@/store/authStore";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import { useChatStore } from "@/store/chatStore";
import { useSocketContext } from "@/context/SocketContext";

const ChatsScreen = () => {
  const { data, isLoading } = useGetMyChatsQuery();
  const { userInfo } = useAuthStore();
  const { setChats } = useChatStore();
  const [onlineUsersIds, setOnlineUsersIds] = useState<string[]>([]);

  useEffect(() => {
    if (data && data?.length > 0) {
      setChats(data);
    }
  }, [data]);

  const { socket } = useSocketContext();

  useEffect(() => {
    const getOnlineUserHandler = (usersIds: string[]) => {
      setOnlineUsersIds(usersIds);
    };
    socket?.on("getOnlineUsers", getOnlineUserHandler);

    return () => {
      if (socket) {
        socket.off("getOnlineUsers", getOnlineUserHandler);
      }
    };
  }, [socket]);

  if (isLoading || data === undefined) {
    return <LoaderFullScreen />;
  }

  const isOnlineHandler = (id: number) => {
    const isOnline = onlineUsersIds.find((f) => parseInt(f) === id);
    return isOnline ? true : false;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ width: "100%", flex: 1 }}>
        {data.length === 0 && (
          <Text className="text-center mt-4">No chats available</Text>
        )}
        {data.map((item, index) => {
          const friend = item.friends.find(
            (friend) => friend.id !== userInfo?.id
          );
          if (!friend) return null;

          return (
            <UserChat
              key={index}
              item={{
                id: item.id,
                name: friend.name,
                image: friend.avatar,
                lastMessage: item.lastMessage,
                createdAt: item.createdAt,
                isOnline: isOnlineHandler(friend.id),
              }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ChatsScreen;
