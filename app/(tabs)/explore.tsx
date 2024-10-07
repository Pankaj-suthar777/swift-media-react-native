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
import RenderFriend from "@/components/RenderFriend";

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
        data={data?.peoples || []}
        renderItem={({ item }) => <RenderFriend item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 10,
    paddingBottom: 80,
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
