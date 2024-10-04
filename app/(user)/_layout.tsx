import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile/[userId]"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat/[chatId]"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
}
