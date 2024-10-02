import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHtml from "react-native-render-html";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/@types/user";
import PostsTab from "@/components/profile/PostTab";

const AboutTab = ({
  userInfo,
  width,
}: {
  userInfo: User | null;
  width: number;
}) => (
  <View className="p-5 bg-gray-100 rounded-lg mx-4 mb-2 mt-4">
    <Text className="text-lg font-bold mb-3">About</Text>
    <RenderHtml
      contentWidth={width}
      source={{ html: userInfo?.about || "<p>No information available</p>" }}
    />
  </View>
);

const ProfileScreen = () => {
  const { userInfo } = useAuthStore();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "posts", title: "Posts" },
    { key: "about", title: "About" },
  ]);

  const renderScene = SceneMap({
    posts: PostsTab,
    about: () => <AboutTab userInfo={userInfo} width={width} />,
  });

  return (
    <SafeAreaView className="flex-grow bg-white">
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
                userInfo?.avatar ||
                "https://bootdey.com/img/Content/avatar/avatar6.png",
            }}
            className="w-24 h-24 rounded-full absolute bottom-[-40px] mx-5"
          />
        </ImageBackground>

        <View className="p-5">
          <Text className="text-2xl font-bold">{userInfo?.name}</Text>
          <Text className="text-base text-gray-500 mb-2">
            {userInfo?.email}
          </Text>
          <View className="mb-5 flex-row gap-4">
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
          <TouchableOpacity className="bg-green-100 py-2 px-6 rounded mb-3">
            <Text className="text-green-600 text-base text-center">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TabView
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
    </SafeAreaView>
  );
};

export default ProfileScreen;
