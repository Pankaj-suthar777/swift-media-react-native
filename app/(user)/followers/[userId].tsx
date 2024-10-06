import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFetchUserFollowersList } from "@/hooks/query/userQuery";
import { useLocalSearchParams, useNavigation } from "expo-router";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import { RenderFriend } from "@/app/(tabs)/explore";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const FollowersScreen = () => {
  const { userId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { data, isLoading } = useFetchUserFollowersList(
    parseInt(userId as string)
  );

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
            <Text className="text-lg font-bold">Followers</Text>
          </View>
        </View>
        <FlatList
          ListEmptyComponent={
            <View className="mt-8">
              <Text className="text-center">No followers yet.</Text>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          data={data?.followers}
          renderItem={({ item }) => <RenderFriend item={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default FollowersScreen;

const styles = StyleSheet.create({});
