import { useFetchChatMessageQuery } from "@/hooks/query/chatQuery";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
} from "react-native";

export default function ChatScreen() {
  const navigation = useNavigation();

  const { chatId } = useLocalSearchParams();
  const { userInfo } = useAuthStore();

  const { data } = useFetchChatMessageQuery(parseInt(chatId as string));

  const { chats } = useChatStore();

  const [chatUser, setChatUser] = useState<{
    name: string | undefined;
    profile_image: string | undefined;
    last_seen: string | undefined;
    id: number | undefined;
  }>();

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

  const [inputMessage, setInputMessage] = useState("");

  function sendMessage() {
    if (inputMessage === "") {
      return setInputMessage("");
    }

    setInputMessage("");
  }

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
              onPress={() => {
                navigation.goBack();
              }}
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
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "black", fontWeight: "700", fontSize: 18 }}>
                {chatUser?.name}
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
          style={{ backgroundColor: "#f2f2ff" }}
          inverted={true}
          data={data}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback>
              <View style={{ marginTop: 6 }}>
                <View
                  style={{
                    maxWidth: Dimensions.get("screen").width * 0.8,
                    backgroundColor: "#3a6ee8",
                    alignSelf:
                      item.senderId === userInfo?.id
                        ? "flex-end"
                        : "flex-start",
                    marginHorizontal: 10,
                    padding: 10,
                    borderRadius: 8,
                    borderBottomLeftRadius:
                      item.senderId === userInfo?.id ? 8 : 0,
                    borderBottomRightRadius:
                      item.senderId === userInfo?.id ? 0 : 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                    }}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={{
                      color: "#dfe4ea",
                      fontSize: 14,
                      alignSelf: "flex-end",
                    }}
                  >
                    {moment(item?.created_at).format("LT")}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />

        <View style={{ paddingVertical: 10 }}>
          <View style={styles.messageInputView}>
            <TextInput
              defaultValue={inputMessage}
              style={styles.messageInput}
              placeholder="Message"
              onChangeText={(text) => setInputMessage(text)}
              onSubmitEditing={() => {
                sendMessage();
              }}
            />
            <TouchableOpacity
              style={styles.messageSendView}
              onPress={() => {
                sendMessage();
              }}
            >
              <Ionicons name="send" type="material" />
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
    display: "flex",
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
    display: "flex",
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
