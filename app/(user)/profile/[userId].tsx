import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import PostsTab from "@/components/profile/PostTab";
import AboutTab from "@/components/profile/AboutTab";
import { useFetchUser } from "@/hooks/query/userQuery";
import { useLocalSearchParams } from "expo-router";
import LoaderFullScreen from "../../../components/ui/LoaderFullScreen";
import Button from "@/components/ui/Button";

const UserProfileScreen = () => {
  const { userId } = useLocalSearchParams();

  const { data, isLoading } = useFetchUser(parseInt(userId as string));
  const { width } = useWindowDimensions();

  // Moved out of conditional blocks
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "posts", title: "Posts" },
    { key: "about", title: "About" },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request (e.g., fetching new data)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Adjust the timeout to match your loading duration
  };

  const renderScene = SceneMap({
    posts: () => <PostsTab userId={data?.user.id as number} />,
    about: () => <AboutTab about={data?.user.about || ""} width={width} />,
  });

  if (isLoading) {
    return (
      <View className="flex-1">
        <LoaderFullScreen />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        className="flex-grow bg-white"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="items-start">
          <ImageBackground
            className="w-full h-[150px] relative mb-[40px]"
            source={{
              uri: "https://www.lightstalking.com/wp-content/uploads/backlit-beach-color-258109-3-1024x576.jpg",
            }}
          >
            <Image
              source={{
                uri:
                  data?.user?.avatar ||
                  "https://bootdey.com/img/Content/avatar/avatar6.png",
              }}
              className="w-24 h-24 rounded-full absolute bottom-[-40px] mx-5"
            />
          </ImageBackground>

          <View className="p-5">
            <Text className="text-2xl font-bold">{data?.user?.name}</Text>
            <Text className="text-base text-gray-500 mb-2">
              {data?.user?.email}
            </Text>
            <View className="mb-5 flex-row gap-4">
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
            <View className="flex-row w-full justify-between gap-2">
              <View className="flex-1">
                <Button variant="secondary">Follow</Button>
              </View>
              <View className="flex-1">
                <Button variant="ghost">Message</Button>
              </View>
            </View>
          </View>
        </View>
        <TabView
          className="h-screen w-screen"
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "green" }}
              style={{ backgroundColor: "white" }}
              labelStyle={{ color: "black" }}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
