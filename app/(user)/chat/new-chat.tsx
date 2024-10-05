import React, { useState, useEffect } from "react";
import {
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
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, Link } from "expo-router";
import useSendMessageMutation from "@/hooks/mutation/useSendMessageMutation";
import { router } from "expo-router";

export default function NewChatScreen() {
  const navigation = useNavigation();
  const [inputMessage, setInputMessage] = useState("");
  const [chatUser, setChatUser] = useState<{
    name: string | undefined;
    profile_image: string | undefined;
    id: number | undefined;
  }>();

  const { mutate, data } = useSendMessageMutation(chatUser?.id as number);

  function sendMessage() {
    if (inputMessage === "") {
      return setInputMessage("");
    }

    mutate({ text: inputMessage });

    console.log("data.chat_id", data.chat_id);

    // router.replace({
    //   pathname: "/(user)/chat/[chatId]",
    //   params: data.chat_id,
    // });

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
            </View>
          </View>
        </Link>
      ),
    });
  }, [chatUser]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={{ marginTop: 6 }}>
            <View
              style={{
                width: Dimensions.get("screen").width,
                backgroundColor: "#3a6ee8",
                marginHorizontal: 10,
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                }}
              >
                Begin a new chat
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
