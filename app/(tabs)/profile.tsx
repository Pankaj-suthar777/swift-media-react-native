import AboutTab from "@/components/profile/AboutTab";
import PostsTab from "@/components/profile/PostTab";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Ionicons } from "@expo/vector-icons";
import { useFetchMyNotificationsCountQuery } from "@/hooks/query/userQuery";

export default function ProfileScreen() {
  const { userInfo, logout } = useAuthStore();
  const [tab, setTab] = useState("posts");
  const navigation = useNavigation();
  const { data, isLoading } = useFetchMyNotificationsCountQuery();
  useEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <View className="flex-row">
            {!isLoading ? (
              <Pressable
                className="relative"
                onPress={() => router.navigate("/(user)/notifictions")}
              >
                <Text className="mx-4 items-center">
                  <Ionicons name="notifications-outline" size={24} />
                </Text>
                {data && data?.notificationsCount > 0 ? (
                  <View className="h-5 w-5 rounded-full bg-green-300 absolute top-[-8px] right-2 justify-center items-center">
                    <Text>{data?.notificationsCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            ) : null}
            <Menu>
              <MenuTrigger>
                <View className="mr-2 ">
                  <Text className="items-center">
                    <Ionicons name="settings-outline" size={24} />
                  </Text>
                </View>
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
          </View>
        );
      },
    });
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="relative">
        <ImageBackground
          className="h-[150px] w-full object-cover justify-center items-center"
          source={
            userInfo?.backgroundImage
              ? { uri: userInfo.backgroundImage }
              : require("../../assets/images/image3.jpg")
          }
        >
          <View className="absolute bottom-[-60px] left-[20px]">
            <Image
              className="z-20 h-[120px] w-[120px] rounded-full"
              source={
                userInfo?.avatar
                  ? {
                      uri: userInfo?.avatar,
                    }
                  : require("../../assets/images/user-profile2.jpg")
              }
              resizeMode="cover"
            />
          </View>
        </ImageBackground>
      </View>
      <View className="px-5 pt-20">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">{userInfo?.name}</Text>
            <Text className="text-base text-gray-500 mb-2">
              {userInfo?.email}
            </Text>
          </View>
          <View className="justify-center">
            <Button
              variant="outline"
              containerClass="px-6"
              onPress={() => router.push("/(user)/edit-profile")}
            >
              Edit Profile
            </Button>
          </View>
        </View>
        <View className="w-full flex-row items-center justify-between">
          <View className="flex-row gap-4 items-center">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(user)/followers/[userId]",
                  params: {
                    userId: userInfo?.id as number,
                  },
                })
              }
              className="flex-row items-center text-base gap-x-2"
            >
              <Text className="font-bold text-slate-900 text-lg">
                {userInfo?.followersCount}
              </Text>
              <Text className="text-gray-500">Followers</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(user)/following/[userId]",
                  params: {
                    userId: userInfo?.id as number,
                  },
                })
              }
              className="flex-row items-center text-base gap-x-2"
            >
              <Text className="font-bold text-slate-900 text-lg">
                {userInfo?.followingCount}
              </Text>
              <Text className="text-gray-500">Following</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View className="w-full flex-row px-3 my-2">
        <View className="w-1/2">
          <Button
            variant={tab !== "posts" ? "ghost" : "default"}
            containerClass="rounded-none border border-teal-400"
            onPress={() => setTab("posts")}
          >
            Posts
          </Button>
        </View>
        <View className="w-1/2">
          <Button
            variant={tab === "posts" ? "ghost" : "default"}
            containerClass="rounded-none border border-teal-400"
            onPress={() => setTab("about")}
          >
            About
          </Button>
        </View>
      </View>
      {tab === "posts" ? (
        <PostsTab userId={userInfo?.id as number} />
      ) : (
        <AboutTab width={100} about={userInfo?.about || ""} />
      )}
    </ScrollView>
  );
}
