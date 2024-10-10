import { SocketContextProvider } from "@/context/SocketContext";
import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <SocketContextProvider>
      <Stack>
        <Stack.Screen
          name="profile/[userId]"
          options={{
            title: "Profile",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="chat/[chatId]"
          options={{
            title: "Profile",
          }}
        />
        <Stack.Screen
          name="chat/new-chat/[userId]"
          options={{
            title: "New Chat",
          }}
        />
        <Stack.Screen
          name="search/search"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="following/[userId]"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="followers/[userId]"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="post/[postId]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="saved-post"
          options={{
            headerShown: true,
            title: "Saved Post",
          }}
        />
        <Stack.Screen
          name="change-password"
          options={{
            headerShown: true,
            title: "Change Password",
          }}
        />
      </Stack>
    </SocketContextProvider>
  );
}
