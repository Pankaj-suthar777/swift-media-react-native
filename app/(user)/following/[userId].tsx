import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetchUserFollowingList } from "@/hooks/query/userQuery";
import { useLocalSearchParams, useNavigation } from "expo-router";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import { RenderFriend } from "@/app/(tabs)/explore";
import Ionicons from "@expo/vector-icons/Ionicons";

const FollowingScreen = () => {
  const { userId } = useLocalSearchParams();
  const { data, isLoading } = useFetchUserFollowingList(
    parseInt(userId as string)
  );
  const navigation = useNavigation();

  if (isLoading) {
    return <LoaderFullScreen />;
  }

  return (
    <SafeAreaView className="mt-4">
      <View>
        <View className="flex-row items-center mb-4 px-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </Pressable>
          <View className="flex-1 ml-4">
            <Text className="text-lg font-bold">Following</Text>
          </View>
        </View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          data={data?.following}
          renderItem={({ item }) => <RenderFriend item={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default FollowingScreen;

const styles = StyleSheet.create({});
