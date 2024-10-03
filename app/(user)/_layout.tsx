import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
      <Stack.Screen
        name="profile/[userId]"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
