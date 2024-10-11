import AboutTab from "@/components/profile/AboutTab";
import PostsTab from "@/components/profile/PostTab";
import Button from "@/components/ui/Button";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import useFollowUserMutation from "@/hooks/mutation/useFollowUserMutation";
import { useFetchOtherUserChatWithMe } from "@/hooks/query/chatQuery";
import { useFetchIsFollow, useFetchUser } from "@/hooks/query/userQuery";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, Pressable, RefreshControl } from "react-native";
import { Image, ScrollView, Text, View } from "react-native";
import { useQueryClient } from "react-query";

export default function ProfileScreen() {
  const [isFollow, setIsFollow] = useState(false);
  const [tab, setTab] = useState("posts");
  const queryClient = useQueryClient();
  const { userId } = useLocalSearchParams();
  const { data, isLoading, refetch, isFetching } = useFetchUser(
    parseInt(userId as string)
  );

  const onRefresh = async () => {
    await refetch();
    queryClient.invalidateQueries(["posts", userId]);
  };

  const { data: chatData } = useFetchOtherUserChatWithMe(
    parseInt(userId as string)
  );

  const { data: isFollowData, isLoading: isFollowDataLoading } =
    useFetchIsFollow(parseInt(userId as string));

  useEffect(() => {
    if (isFollowData === true || isFollowData === false) {
      setIsFollow(isFollowData);
    }
  }, [isFollowData]);

  const { mutate, isLoading: followToggleLoading } = useFollowUserMutation(
    parseInt(userId as string)
  );

  const followToggleHandler = () => {
    mutate();
    setIsFollow(!isFollow);
  };

  if (isLoading) {
    return (
      <View className="flex-1">
        <LoaderFullScreen />
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <ImageBackground
            className="h-[150px] w-full object-cover justify-center items-center"
            source={
              data?.user.backgroundImage
                ? { uri: data.user.backgroundImage }
                : require("../../../assets/images/image3.jpg")
            }
          >
            <View className="absolute bottom-[-60px] left-[20px]">
              <Image
                source={
                  data?.user?.avatar
                    ? {
                        uri: data?.user?.avatar,
                      }
                    : require("../../../assets/images/user-profile2.jpg")
                }
                className="z-20 h-[120px] w-[120px] rounded-full"
                resizeMode="cover"
              />
            </View>
          </ImageBackground>
        </View>
        <View className="px-5 pt-20">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold">{data?.user?.name}</Text>
              <Text className="text-base text-gray-500 mb-2">
                {data?.user?.email}
              </Text>
            </View>
          </View>
          <View className="w-full flex-row items-center justify-between">
            <View className="flex-row gap-4 items-center">
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(user)/followers/[userId]",
                    params: {
                      userId: parseInt(userId as string),
                    },
                  })
                }
                className="flex-row items-center text-base gap-x-2"
              >
                <Text className="font-bold text-slate-900 text-lg">
                  {data?.user?.followersCount}
                </Text>
                <Text className="text-gray-500">Followers</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(user)/following/[userId]",
                    params: {
                      userId: parseInt(userId as string),
                    },
                  })
                }
                className="flex-row items-center text-base gap-x-2"
              >
                <Text className="font-bold text-slate-900 text-lg">
                  {data?.user?.followingCount}
                </Text>
                <Text className="text-gray-500">Following</Text>
              </Pressable>
            </View>
          </View>

          <View className="w-full flex-row items-center justify-between">
            <View className="flex-1 mr-2">
              {isFollowDataLoading ? null : (
                <Button
                  variant="outline"
                  onPress={followToggleHandler}
                  isLoading={followToggleLoading}
                >
                  {isFollow ? "Unfollow" : "Follow"}
                </Button>
              )}
            </View>

            <View className="flex-1">
              <Button
                variant="outline"
                onPress={() => {
                  if (chatData?.id) {
                    router.push({
                      pathname: "/(user)/chat/[chatId]",
                      params: {
                        chatId: chatData.id,
                      },
                    });
                  } else {
                    router.push({
                      pathname: "/(user)/chat/new-chat/[userId]",
                      params: {
                        userId: userId as string,
                      },
                    });
                  }
                }}
              >
                Message
              </Button>
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
          <PostsTab userId={parseInt(userId as string)} />
        ) : (
          <AboutTab width={100} about={data?.user.about || ""} />
        )}
      </ScrollView>
    </View>
  );
}
