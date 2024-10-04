import { ScrollView, Text, View } from "react-native";
import React, { useEffect } from "react";
import UserChat from "@/components/chat/UserChat";
import { useGetMyChatsQuery } from "@/hooks/query/chatQuery";
import { useAuthStore } from "@/store/authStore";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import { useChatStore } from "@/store/chatStore";

const ChatsScreen = () => {
  const { data, isLoading } = useGetMyChatsQuery();
  const { userInfo } = useAuthStore();
  const { setChats } = useChatStore();

  useEffect(() => {
    if (data && data?.length > 0) {
      setChats(data);
    }
  }, [data]);

  if (isLoading || data === undefined) {
    return <LoaderFullScreen />;
  }

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
              }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ChatsScreen;
