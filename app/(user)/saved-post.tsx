import Post from "@/components/post/Post";
import EmptyRecords from "@/components/ui/EmptyRecords";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import PaginatedList from "@/components/ui/PaginatedList";
import { fetchSavedPost, useFetchSavedPost } from "@/hooks/query/postQuery";
import React, { useState } from "react";
import { View } from "react-native";
import { useQueryClient } from "react-query";

let pageNo = 0;

const SavedPostScreen = () => {
  const queryClient = useQueryClient();

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { data, isLoading, isFetching } = useFetchSavedPost(0);

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries(["saved-posts"]);
  };

  const handleOnEndReached = async () => {
    if (!data || !hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const nextPageNo = pageNo + 1;
      const res = await fetchSavedPost(nextPageNo);

      if (!res || !res.posts.length) {
        setHasMore(false);
      } else {
        const newData = [...data.posts, ...res.posts];
        queryClient.setQueryData(["saved-posts"], { posts: newData });
        pageNo = nextPageNo;
      }
    } catch (error) {
      console.log(error);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  };

  if (isLoading) {
    return <LoaderFullScreen />;
  }

  return (
    <View>
      <PaginatedList
        data={data?.posts}
        renderItem={({ item }) => <Post post={item} />}
        onEndReached={handleOnEndReached}
        ListEmptyComponent={
          <View className="mt-4">
            <EmptyRecords title="No posts" />
          </View>
        }
        refreshing={isFetching}
        onRefresh={handleOnRefresh}
        isFetching={isFetchingMore}
        hasMore={hasMore}
      />
      <View className="flex-grow h-12 mt-16 w-full"></View>
    </View>
  );
};

export default SavedPostScreen;
