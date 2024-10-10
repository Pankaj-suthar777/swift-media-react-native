import AboutTab from "@/components/profile/AboutTab";
import PostsTab from "@/components/profile/PostTab";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
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
  const { userInfo } = useAuthStore();
  const [tab, setTab] = useState("posts");
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
    outputRange: [1, 0.6],
    extrapolate: "clamp",
  });

  const opacityName = scrollY.interpolate({
    inputRange: [0, offset], // Name will be fully hidden at the top and fully visible when scrolled down
    outputRange: [0, 1], // Hidden at the top (0), visible when scrolled down
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView>
      <View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <View className="px-5">
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
              userInfo?.backgroundImage
                ? { uri: userInfo.backgroundImage }
                : require("../../assets/images/image3.jpg")
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
                  userInfo?.avatar
                    ? {
                        uri: userInfo?.avatar,
                      }
                    : require("../../assets/images/user-profile2.jpg")
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
            {userInfo?.name}
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
    top: -60,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    paddingTop: headerHeight / 1.2,
  },
  image: {
    marginTop: 10,
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
    color: "white",
    position: "absolute",
    bottom: -5,
    height: headerFinalHeight,
    textAlignVertical: "center",
    letterSpacing: 2,
  },
});
