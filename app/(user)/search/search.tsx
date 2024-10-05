import { FlatList, Pressable, Text, View } from "react-native";
import React, { useState } from "react";
import { useFetchSearchUser } from "@/hooks/query/userQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomTextInput from "@/components/ui/TextInput";
import { useNavigation } from "expo-router";
import { renderFriend } from "@/app/(tabs)/explore";
import Loader from "@/components/ui/Loader";
import EmptyRecords from "@/components/ui/EmptyRecords";
import Feather from "@expo/vector-icons/Feather";

const Search = () => {
  const [searchValue, setSerachValue] = useState("");
  const navigation = useNavigation();
  const { data, isLoading } = useFetchSearchUser(searchValue);

  return (
    <SafeAreaView className="px-4 mt-4">
      <View className="flex-row items-center">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </Pressable>
        <View className="flex-1 ml-4">
          <CustomTextInput
            placeholder="Search..."
            onChange={setSerachValue}
            value={searchValue}
          />
        </View>
      </View>

      <View className="mt-4">
        {searchValue === "" && (
          <View className="h-[80%] justify-center items-center">
            <Feather name="users" size={44} color={"black"} />
            <Text className="mt-4 text-xs font-semibold">
              Search user by name
            </Text>
          </View>
        )}
        {isLoading ? (
          <View className="justify-center items-center flex-row">
            <Loader size={24} />
          </View>
        ) : (
          <FlatList
            data={data || []}
            renderItem={renderFriend}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              searchValue.length > 0 ? (
                <View className="mt-4">
                  <EmptyRecords title="No user found" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;
