import { Redirect, router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/store/authStore";
import { StyleSheet, Text, View } from "react-native";
import LoadingAnimation from "@/components/LoadingAnimation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SocketContextProvider } from "@/context/SocketContext";
import { useGetMyChatsQuery } from "@/hooks/query/chatQuery";
import { useChatStore } from "@/store/chatStore";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

// import useCheckTokenValidity from "@/hooks/useCheckTokenValidity";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isLoading, setUserInfo, userInfo, logout } = useAuthStore();
  const { setChats } = useChatStore();
  const { data, isLoading: isChatsLoading } = useGetMyChatsQuery();

  useEffect(() => {
    if (data && data?.length > 0) {
      setChats(data);
    }
  }, [data]);
  // const { isAuthLoading, isAuthenticated } = useCheckTokenValidity();

  if (!userInfo) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isLoading || isChatsLoading) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: Colors.light.background,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <LoadingAnimation />
      </View>
    );
  }

  return (
    <SocketContextProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={"home"} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={"search1"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            headerShown: true,
            title: "Chats",
            headerTitleStyle: {
              fontSize: 28,
              fontWeight: "bold",
            },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                IconComponent={Ionicons}
                name={"chatbubble-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: true,

            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={"user"} color={color} />
            ),

            headerRight() {
              return (
                <Menu>
                  <MenuTrigger>
                    <Text className="mx-4 items-center">
                      <Ionicons name="settings-outline" size={24} />;
                    </Text>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption
                      style={{ padding: 12 }}
                      onSelect={() => {
                        router.navigate("/(user)/saved-post");
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>Saved Posts</Text>
                    </MenuOption>
                    <View
                      style={{
                        width: "100%",
                        height: 0.5,
                        backgroundColor: "black",
                      }}
                    ></View>
                    <MenuOption
                      style={{ padding: 12 }}
                      onSelect={() => {
                        logout();
                        router.navigate("/(auth)/login");
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>Logout</Text>
                    </MenuOption>
                    <View
                      style={{
                        width: "100%",
                        height: 0.5,
                        backgroundColor: "black",
                      }}
                    ></View>
                    <MenuOption
                      style={{ padding: 12 }}
                      onSelect={() => {
                        router.navigate("/(user)/change-password");
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>Change Password</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              );
            },
          }}
        />
      </Tabs>
    </SocketContextProvider>
  );
}
