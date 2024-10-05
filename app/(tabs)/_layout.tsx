import { Redirect, Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/store/authStore";
import { StyleSheet, View } from "react-native";
import LoadingAnimation from "@/components/LoadingAnimation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SocketContextProvider } from "@/context/SocketContext";

// import useCheckTokenValidity from "@/hooks/useCheckTokenValidity";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isLoading, setUserInfo, userInfo } = useAuthStore();

  // const { isAuthLoading, isAuthenticated } = useCheckTokenValidity();

  if (isLoading) {
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
  if (!userInfo) {
    return <Redirect href="/(auth)/login" />;
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
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={"user"} color={color} />
            ),
          }}
        />
      </Tabs>
    </SocketContextProvider>
  );
}
