import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { clearAsyncStorage } from "@/utils/asyncStorage";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
const onPress = () => {
  router.navigate("/(auth)/login");
};
const Home = () => {
  const { logout } = useAuthStore();
  const logoutHandler = () => {
    logout();
    clearAsyncStorage();
  };

  return (
    <View className="justify-center items-center flex-1">
      <Button onPress={onPress}>Go to login</Button>
      <Button onPress={logoutHandler}>Logout</Button>
    </View>
  );
};

export default Home;
