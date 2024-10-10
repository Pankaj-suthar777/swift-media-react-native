import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPosts, useGetFeed } from "@/hooks/query/postQuery";
import Post from "@/components/post/Post";
import PaginatedList from "@/components/ui/PaginatedList";
import { useQueryClient } from "react-query";
import EmptyRecords from "@/components/ui/EmptyRecords";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import CreatePostModal from "@/components/home/CreatePostModal";

let pageNo = 0;

const HomeScreen = () => {
  const queryClient = useQueryClient();

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isFetching } = useGetFeed(0);

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries(["posts"]);
  };

  const handleOnEndReached = async () => {
    if (!data || !hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const nextPageNo = pageNo + 1;
      const res = await fetchPosts(nextPageNo);

      if (!res || !res.posts.length) {
        setHasMore(false);
      } else {
        const newData = [...data.posts, ...res.posts];
        queryClient.setQueryData(["feed-posts"], { posts: newData });
        pageNo = nextPageNo;
      }
    } catch (error) {
      console.log(error);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(1.2, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  if (isLoading) {
    return <LoaderFullScreen />;
  }

  return (
    <>
      <SafeAreaView className="bg-slate-50 flex-1 relative">
        <Text className="text-2xl px-4 font-bold py-4">Feed</Text>

        <Animated.View
          style={[animatedStyle]}
          className={"absolute z-10 bottom-4 right-4"}
        >
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => setIsOpen(true)}
            className="w-12 h-12 bg-blue-400 rounded-full justify-center items-center"
          >
            <FontAwesome5 name="feather" color="white" size={20} />
          </Pressable>
        </Animated.View>

        <PaginatedList
          data={data?.posts}
          renderItem={({ item }) => <Post post={item} />}
          onEndReached={handleOnEndReached}
          ListEmptyComponent={<EmptyRecords title="No posts" />}
          refreshing={isFetching}
          onRefresh={handleOnRefresh}
          isFetching={isFetchingMore}
          hasMore={hasMore}
        />
      </SafeAreaView>
      <CreatePostModal setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
};

export default HomeScreen;
