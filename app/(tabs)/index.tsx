import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPosts, useGetFeed } from "@/hooks/query/postQuery";
import LoadingAnimation from "@/components/LoadingAnimation";
import Post from "@/components/post/Post";
import PaginatedList from "@/components/ui/PaginatedList";
import { useQueryClient } from "react-query";
import EmptyRecords from "@/components/ui/EmptyRecords";

let pageNo = 0;

const HomeScreen = () => {
  const queryClient = useQueryClient();

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { data, isLoading, isFetching } = useGetFeed(0);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center z-10">
        <LoadingAnimation />
      </View>
    );
  }

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries(["posts"]); // Adjusted to use the array form
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
        queryClient.setQueryData(["posts"], { posts: newData });
        pageNo = nextPageNo;
      }
    } catch (error) {
      console.log(error);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  };

  return (
    <SafeAreaView className="bg-slate-50 flex-1">
      <Text className="text-2xl px-4 font-bold py-4">Feed</Text>
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
      <View className="flex-grow mt-8 w-full" />
    </SafeAreaView>
  );
};

export default HomeScreen;
