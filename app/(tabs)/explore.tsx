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

const ExploreScreen = () => {
  const { data, isLoading } = useFetchAllUser();

  if (isLoading || data === undefined) {
    return <LoaderFullScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable
        className="mx-4"
        onPress={() => {
          router.push("/(user)/search/search");
        }}
      >
        <View className="flex-row items-center bg-gray-200 rounded-full p-2">
          <Ionicons name="search" size={20} color="gray" />
          <View style={{ flex: 1 }} className="ml-2 text-base">
            <Text>Search...</Text>
          </View>
        </View>
      </Pressable>

      <FlatList
        data={data?.peoples}
        renderItem={RenderFriend}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

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

export default ExploreScreen;

export const RenderFriend = ({
  item,
  showFollowButton = true,
}: {
  item: People;
  showFollowButton?: boolean;
}) => {
  const plainText = item.about ? HTMLParser.parse(item.about).text : "";
  return (
    <View style={styles.card}>
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
          <Image
            source={
              item.avatar
                ? {
                    uri: item.avatar,
                  }
                : require("../../assets/images/user-profile2.jpg")
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
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.about}>
                {plainText}
              </Text>
            )}
          </Pressable>
        </Link>
        {showFollowButton && (
          <Button variant="ghost">
            {item.isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </View>
    </View>
  );
};
