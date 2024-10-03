import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useAuthStore } from "@/store/authStore";
import PostsTab from "@/components/profile/PostTab";
import AboutTab from "@/components/profile/AboutTab";
import Button from "@/components/ui/Button";

const ProfileScreen = () => {
  const { userInfo } = useAuthStore();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "posts", title: "Posts" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    posts: () => <PostsTab userId={userInfo?.id as number} />,
    about: () => <AboutTab about={userInfo?.about || ""} width={width} />,
  });

  return (
    <SafeAreaView className="flex-grow bg-white">
      <ScrollView className="flex-grow bg-white">
        <View className="items-start">
          <ImageBackground
            className="w-full h-[150px] relative mb-[40px]"
            source={{
              uri: "https://www.lightstalking.com/wp-content/uploads/backlit-beach-color-258109-3-1024x576.jpg",
            }}
          >
            {userInfo?.avatar ? (
              <Image
                source={{
                  uri: userInfo?.avatar,
                }}
                className="w-24 h-24 rounded-full absolute bottom-[-40px] mx-5"
              />
            ) : (
              <Image
                source={require("../../assets/images/user-profile2.jpg")}
                className="w-24 h-24 rounded-full absolute bottom-[-40px] mx-5"
              />
            )}
          </ImageBackground>

          <View className="p-5">
            <Text className="text-2xl font-bold">{userInfo?.name}</Text>
            <Text className="text-base text-gray-500 mb-2">
              {userInfo?.email}
            </Text>
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row gap-4 items-center">
                <View className="flex-row items-center text-base gap-x-2">
                  <Text className="font-bold text-slate-900 text-lg">
                    {userInfo?.followersCount}
                  </Text>
                  <Text className="text-gray-500">Followers</Text>
                </View>

                <View className="flex-row items-center text-base gap-x-2">
                  <Text className="font-bold text-slate-900 text-lg">
                    {userInfo?.followingCount}
                  </Text>
                  <Text className="text-gray-500">Following</Text>
                </View>
              </View>
              <View className="justify-center">
                <Button variant="secondary" containerClass="px-6">
                  Edit Profile
                </Button>
              </View>
            </View>
          </View>
        </View>

        <TabView
          className="h-[95vh] w-screen"
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

export default ProfileScreen;
