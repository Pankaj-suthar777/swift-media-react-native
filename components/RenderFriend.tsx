import { People, useFetchAllUser } from "@/hooks/query/userQuery";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import * as HTMLParser from "fast-html-parser";
import Button from "@/components/ui/Button";
import { Link, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "@/store/authStore";

const RenderFriend = ({
  item,
  showFollowButton = true,
}: {
  item: People;
  showFollowButton?: boolean;
}) => {
  const { userInfo } = useAuthStore();
  const plainText = item.about ? HTMLParser.parse(item.about).text : "";

  return (
    <View style={styles.card}>
      <Link
        asChild
        href={
          item.id === userInfo?.id
            ? "/(tabs)/profile"
            : {
                pathname: "/(user)/profile/[userId]",
                params: {
                  userId: item?.id,
                },
              }
        }
      >
        <Pressable className="justify-center">
          <Image
            source={
              item.avatar
                ? {
                    uri: item.avatar,
                  }
                : require("../assets/images/user-profile2.jpg")
            }
            style={styles.image}
          />
        </Pressable>
      </Link>

      <View style={styles.info}>
        <Link
          asChild
          href={{
            pathname: "/(user)/profile/[userId]",
            params: {
              userId: item?.id,
            },
          }}
        >
          <Pressable>
            <Text style={styles.name}>{item.name}</Text>
            {plainText && (
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.about}>
                {plainText}
              </Text>
            )}
          </Pressable>
        </Link>
        {showFollowButton && userInfo?.id !== item.id && (
          <Button variant="outline">
            {item.isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </View>
    </View>
  );
};

export default RenderFriend;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensure it takes up full height, so the padding applies correctly
  },
  container: {
    padding: 10,
    paddingBottom: 80, // Add padding to avoid content being cut off by tab bar
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fbfbfb",
    borderWidth: 2,
    borderColor: "#DCDCDC",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  about: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
});
