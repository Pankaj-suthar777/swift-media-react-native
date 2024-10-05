import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import { Link } from "expo-router";
import moment from "moment";

interface Props {
  item: {
    id: number;
    name: string;
    image: string | undefined;
    lastMessage: string;
    createdAt: string | Date;
    isOnline?: boolean;
  };
}

const UserChat = ({ item }: Props) => {
  return (
    <Link
      href={{
        pathname: "/(user)/chat/[chatId]",
        params: { chatId: item.id },
      }}
    >
      <View style={styles.chatContainer}>
        <Image
          style={styles.userImage}
          source={
            item?.image
              ? { uri: item.image }
              : require("../../assets/images/user-profile2.jpg")
          }
        />
        {item?.isOnline ? <View style={styles.onlineStatus} /> : null}
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text
            style={styles.lastMessage}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
        </View>
        <View>
          <Text style={styles.messageTime}>
            {moment(item.createdAt).format("LL")}
          </Text>
        </View>
      </View>
    </Link>
  );
};

export default UserChat;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  chatContainer: {
    position: "relative",
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderBottomWidth: 0.7,
    borderColor: "#D0D0D0",
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
  onlineStatus: {
    position: "absolute",
    width: 15,
    height: 15,
    backgroundColor: "green",
    borderRadius: 100,
    bottom: 10,
    left: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: "500",
  },
  lastMessage: {
    marginTop: 3,
    color: "gray",
    fontWeight: "500",
  },
  messageTime: {
    fontSize: 11,
    fontWeight: "400",
    color: "#585858",
  },
});
