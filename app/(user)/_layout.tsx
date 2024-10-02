import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="user-profile"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
}
