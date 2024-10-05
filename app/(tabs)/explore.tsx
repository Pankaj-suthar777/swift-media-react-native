import { People, useFetchAllUser } from "@/hooks/query/userQuery";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import * as HTMLParser from "fast-html-parser";
import Button from "@/components/ui/Button";
import { Link, router } from "expo-router";
import CustomTextInput from "@/components/ui/TextInput";
import Ionicons from "@expo/vector-icons/Ionicons";

const ExploreScreen = () => {
  const { data, isLoading } = useFetchAllUser();

  if (isLoading || data === undefined) {
    return <LoaderFullScreen />;
  }
  // <CustomTextInput placeholder="Search" />
  return (
    <SafeAreaView>
      <Pressable
        className="mx-4"
        onPress={() => {
          router.push("/(user)/search/search");
        }}
      >
        <View className="flex-row items-center bg-gray-200 rounded-full p-2 mt-4">
          <Ionicons name="search" size={20} color="gray" />
          <View style={{ flex: 1 }} className="ml-2 text-base">
            <Text>Search...</Text>
          </View>
        </View>
      </Pressable>
      <FlatList
        data={data?.peoples}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const renderFriend = ({ item }: { item: People }) => {
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
        <Button variant="ghost">
          {item.isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
  details: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 16,
    color: "#FFD700",
  },
  sports: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2ECC71",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#2ECC71",
    fontSize: 16,
  },
  about: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
});

export default ExploreScreen;
