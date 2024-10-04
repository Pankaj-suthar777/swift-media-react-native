import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from "react-native";
import { useQueryClient } from "react-query";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, Link, useLocalSearchParams } from "expo-router";
import { useFetchChatMessageQuery } from "@/hooks/query/chatQuery";
import useSendMessageMutation from "@/hooks/mutation/useSendMessageMutation";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useSocketContext } from "@/context/SocketContext";

export default function ChatScreen() {
  const navigation = useNavigation();
  const { chatId } = useLocalSearchParams();
  const { userInfo } = useAuthStore();
  const { data } = useFetchChatMessageQuery(parseInt(chatId as string));
  const { chats } = useChatStore();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [chatUser, setChatUser] = useState<{
    name: string | undefined;
    profile_image: string | undefined;
    last_seen: string | undefined;
    id: number | undefined;
  }>();

  const flatListRef = useRef<FlatList>(null);
  const { socket } = useSocketContext();

  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      queryClient.setQueryData(
        ["chat-messages", parseInt(chatId as string)],
        (oldData: any) => {
          return [...(oldData || []), newMessage];
        }
      );
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      if (socket) {
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [socket, chatId, queryClient]);

  useEffect(() => {
    const getOnlineUserHandler = (usersIds: any) => {
      const currentChatFriend = usersIds.find(
        (f: any) => parseInt(f) === chatUser?.id
      );

      if (currentChatFriend) {
        setChatUser({
          last_seen: "online",
          id: chatUser?.id,
          name: chatUser?.name,
          profile_image: chatUser?.profile_image,
        });
      }
    };

    socket?.on("getOnlineUsers", getOnlineUserHandler);

    return () => {
      if (socket) {
        socket.off("getOnlineUsers", getOnlineUserHandler);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (chats && chatId.length > 0) {
      const chat = chats.find((c) => c.id === parseInt(chatId as string));
      const friend = chat?.friends.find((f) => f.id !== userInfo?.id);
      setChatUser({
        name: friend?.name,
        profile_image: friend?.avatar,
        last_seen: "",
        id: friend?.id,
      });
    }
  }, [chats]);

  const { mutate } = useSendMessageMutation(chatUser?.id as number);

  function sendMessage() {
    if (inputMessage === "" || !data) {
      return setInputMessage("");
    }

    mutate({ text: inputMessage });

    const newMessage = {
      text: inputMessage,
      senderId: userInfo?.id,
      chat_id: parseInt(chatId as string),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    queryClient.setQueryData(
      ["chat-messages", parseInt(chatId as string)],
      (oldData: any) => {
        return [...(oldData || []), newMessage];
      }
    );

    setInputMessage("");
  }

  useEffect(() => {
    if (flatListRef.current && data) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [data]);

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <Link
          href={{
            pathname: "/(user)/profile/[userId]",
            params: { userId: chatUser?.id as number },
          }}
        >
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Image
              style={styles.userProfileImage}
              source={
                chatUser?.profile_image
                  ? { uri: chatUser?.profile_image }
                  : require("../../../assets/images/user-profile2.jpg")
              }
            />
            <View
              style={{
                paddingLeft: 10,
                alignItems: "flex-end",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "black", fontWeight: "700", fontSize: 18 }}>
                {chatUser?.name}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontWeight: "700",
                  fontSize: 10,
                  marginLeft: 10,
                }}
              >
                {chatUser?.last_seen}
              </Text>
            </View>
          </View>
        </Link>
      ),
    });
  }, [chatUser]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef} // Set reference to FlatList
          style={{ backgroundColor: "#f2f2ff" }}
          data={data}
          renderItem={({ item }) => {
            const isOtherUser = item.senderId !== userInfo?.id;
            return (
              <TouchableWithoutFeedback>
                <View style={{ marginTop: 6 }}>
                  <View
                    style={{
                      maxWidth: Dimensions.get("screen").width * 0.8,
                      backgroundColor: isOtherUser ? "white" : "#3a6ee8",
                      alignSelf: isOtherUser ? "flex-start" : "flex-end",
                      marginHorizontal: 10,
                      padding: 10,
                      borderRadius: 8,
                      borderBottomLeftRadius: isOtherUser ? 0 : 8,
                      borderBottomRightRadius: isOtherUser ? 8 : 0,
                    }}
                  >
                    <Text
                      style={{
                        color: isOtherUser ? "black" : "#fff",
                        fontSize: 16,
                      }}
                    >
                      {item.text}
                    </Text>
                    <Text
                      style={{
                        color: isOtherUser ? "black" : "#dfe4ea",
                        fontSize: 14,
                        alignSelf: "flex-end",
                      }}
                    >
                      {moment(item.created_at).format("LT")}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          } // Auto scroll to bottom on content change
        />

        <View style={{ paddingVertical: 10 }}>
          <View style={styles.messageInputView}>
            <TextInput
              value={inputMessage}
              style={styles.messageInput}
              placeholder="Message"
              onChangeText={setInputMessage}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              style={styles.messageSendView}
              onPress={sendMessage}
            >
              <Ionicons name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  userProfileImage: {
    height: 45,
    width: 45,
    borderRadius: 100,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2ff",
  },
  messageInputView: {
    flexDirection: "row",
    marginHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
