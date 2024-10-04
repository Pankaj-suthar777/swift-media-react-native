import AboutTab from "@/components/profile/AboutTab";
import PostsTab from "@/components/profile/PostTab";
import Button from "@/components/ui/Button";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import { useFetchUser } from "@/hooks/query/userQuery";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { RefreshControl } from "react-native";
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
const headerHeight = 300;
const headerFinalHeight = 70;
const imageSize = (headerHeight / 3) * 2;

export default function ProfileScreen() {
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
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const opacityName = scrollY.interpolate({
    inputRange: [0, offset], // Name will be fully hidden at the top and fully visible when scrolled down
    outputRange: [0, 1], // Hidden at the top (0), visible when scrolled down
    extrapolate: "clamp",
  });

  const { userId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading } = useFetchUser(parseInt(userId as string));

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request (e.g., fetching new data)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Adjust the timeout to match your loading duration
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
                <Text className="text-2xl font-bold">{data?.user?.name}</Text>
                <Text className="text-base text-gray-500 mb-2">
                  {data?.user?.name}
                </Text>
              </View>
            </View>
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row gap-4 items-center">
                <View className="flex-row items-center text-base gap-x-2">
                  <Text className="font-bold text-slate-900 text-lg">
                    {data?.user?.followersCount}
                  </Text>
                  <Text className="text-gray-500">Followers</Text>
                </View>

                <View className="flex-row items-center text-base gap-x-2">
                  <Text className="font-bold text-slate-900 text-lg">
                    {data?.user?.followingCount}
                  </Text>
                  <Text className="text-gray-500">Following</Text>
                </View>
              </View>
            </View>

            <View className="w-full flex-row items-center justify-between">
              <View className="flex-1 mr-2">
                <Button variant="ghost">Follow</Button>
              </View>

              <View className="flex-1">
                <Button variant="ghost">Message</Button>
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
            <AboutTab about={data?.user.about || ""} />
          )}
        </ScrollView>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.header,
            { transform: [{ translateY: translateHeader }] },
          ]}
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
              source={{
                uri: data?.user?.avatar,
              }}
              style={styles.img}
              resizeMode="cover"
            />
          </Animated.View>
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
