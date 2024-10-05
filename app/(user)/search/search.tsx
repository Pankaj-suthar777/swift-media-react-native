import { Pressable, Text, View } from "react-native";
import React, { useState } from "react";
import { useFetchSearchUser } from "@/hooks/query/userQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomTextInput from "@/components/ui/TextInput";
import { useNavigation } from "expo-router";

const Search = () => {
  const [searchValue, setSerachValue] = useState("");
  const navigation = useNavigation();
  const { data } = useFetchSearchUser(searchValue);
  return (
    <SafeAreaView className="px-4 mt-4">
      <View className="flex-row items-center">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </Pressable>
        <View className="flex-1 ml-4">
          <CustomTextInput placeholder="Search..." />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Search;

// <View className="flex-row items-center bg-gray-200 rounded-full p-2">
// <Ionicons name="search" size={20} color="gray" />
// <TextInput
//   style={{ flex: 1 }}
//   placeholder="Search..."
//   placeholderTextColor="gray"
//   className="ml-2 text-base"
// />
// </View>
