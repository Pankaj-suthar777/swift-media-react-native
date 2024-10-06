import AboutTab from "@/components/profile/AboutTab";
import PostsTab from "@/components/profile/PostTab";
import Button from "@/components/ui/Button";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import useFollowUserMutation from "@/hooks/mutation/useFollowUserMutation";
import { useFetchOtherUserChatWithMe } from "@/hooks/query/chatQuery";
import { useFetchIsFollow, useFetchUser } from "@/hooks/query/userQuery";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ImageBackground, Pressable, RefreshControl } from "react-native";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const headerHeight = 200;
const headerFinalHeight = 70;
const imageSize = (headerHeight / 3) * 2;

export default function ProfileScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const offset = headerHeight - headerFinalHeight;
  const translateHeader = scrollY.interpolate({
    inputRange: [0, offset],
    outputRange: [0, -offset],
    extrapolate: "clamp",
  });
  const translateImageY = scrollY.interpolate({
    inputRange: [0, offset],
    outputRange: [0, -(headerFinalHeight - headerHeight) / 2],
    extrapolate: "clamp",
  });
  const translateImageX = scrollY.interpolate({
    inputRange: [0, offset],
    outputRange: [
      0,
      -(width / 2) + (imageSize * headerFinalHeight) / headerHeight,
    ],
    extrapolate: "clamp",
  });
  const scaleImage = scrollY.interpolate({
    inputRange: [0, offset],
    outputRange: [1, headerFinalHeight / headerHeight],
    extrapolate: "clamp",
  });
  const translateName = scrollY.interpolate({
    inputRange: [0, offset / 2, offset],
    outputRange: [0, 10, -width / 2 + textWidth / 2 + headerFinalHeight],
    extrapolate: "clamp",
  });
  const scaleName = scrollY.interpolate({
    inputRange: [0, offset],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const opacityName = scrollY.interpolate({
    inputRange: [0, offset],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const [isFollow, setIsFollow] = useState(false);
  const [tab, setTab] = useState("posts");

  const { userId } = useLocalSearchParams();
  const { data, isLoading, refetch, isFetching } = useFetchUser(
    parseInt(userId as string)
  );

  const onRefresh = async () => {
    await refetch();
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
    <SafeAreaView>
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <View className="px-5 mt-2">
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
        <Animated.View
          pointerEvents="none"
          style={[
            styles.header,
            { transform: [{ translateY: translateHeader }] },
          ]}
        >
          <ImageBackground
            className="h-full w-full object-cover justify-center items-center"
            source={
              data?.user.backgroundImage
                ? { uri: data.user.backgroundImage }
                : require("../../../assets/images/image3.jpg")
            }
          >
            <Animated.View
              style={[
                styles.image,
                {
                  transform: [
                    { translateY: translateImageY },
                    { translateX: translateImageX },
                    { scale: scaleImage },
                  ],
                },
              ]}
            >
              <Image
                source={
                  data?.user?.avatar
                    ? {
                        uri: data?.user?.avatar,
                      }
                    : require("../../../assets/images/user-profile2.jpg")
                }
                style={styles.img}
                resizeMode="cover"
              />
            </Animated.View>
          </ImageBackground>
          <Animated.Text
            onTextLayout={(e) => setTextWidth(e.nativeEvent.lines[0].width)}
            style={[
              styles.name,
              {
                transform: [
                  { translateX: translateName },
                  { scale: scaleName },
                ],
                opacity: opacityName,
              },
            ]}
          >
            {data?.user?.name}
          </Animated.Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    height: 100,
    marginBottom: 5,
    backgroundColor: "grey",
    marginHorizontal: 10,
  },
  header: {
    height: headerHeight,
    backgroundColor: "#f2f2f2",
    position: "absolute",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    paddingTop: headerHeight + 5,
  },
  image: {
    height: imageSize,
    width: imageSize,
    borderRadius: headerHeight,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "green",
  },
  img: {
    height: "100%",
    width: "100%",
  },
  name: {
    fontSize: 30,
    color: "#000",
    position: "absolute",
    bottom: 0,
    height: headerFinalHeight,
    textAlignVertical: "center",
    letterSpacing: 2,
  },
});
