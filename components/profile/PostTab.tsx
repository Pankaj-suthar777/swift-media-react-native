import { fetchUserPosts, useFetchUserPosts } from "@/hooks/query/postQuery";
import { useAuthStore } from "@/store/authStore";
import { Text, View } from "react-native";
import PaginatedList from "../ui/PaginatedList";
import { useQueryClient } from "react-query";
import { useState } from "react";
import LoadingAnimation from "../LoadingAnimation";
import EmptyRecords from "../ui/EmptyRecords";
import Post from "../post/Post";

let pageNo = 0;

const PostsTab = () => {
  const { userInfo } = useAuthStore();
  if (!userInfo) {
    return;
  }

  const queryClient = useQueryClient();

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { data, isLoading, isFetching } = useFetchUserPosts(userInfo?.id, 0);

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
    queryClient.invalidateQueries(["posts"]);
  };

  const handleOnEndReached = async () => {
    if (!data || !hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const nextPageNo = pageNo + 1;
      const res = await fetchUserPosts(userInfo.id, nextPageNo);

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
    <View className="mt-4">
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
    </View>
  );
};

export default PostsTab;
