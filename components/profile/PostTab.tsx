import { fetchUserPosts, useFetchUserPosts } from "@/hooks/query/postQuery";
import { useAuthStore } from "@/store/authStore";
import { Text, View } from "react-native";
import PaginatedList from "../ui/PaginatedList";
import { useQueryClient } from "react-query";
import { useState } from "react";
import LoadingAnimation from "../LoadingAnimation";
import EmptyRecords from "../ui/EmptyRecords";
import Post from "../post/Post";
import { Post as IPost } from "@/@types/post";

let pageNo = 0;

const PostsTab = ({ userId }: { userId: number }) => {
  const queryClient = useQueryClient();

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { data, isLoading, isFetching } = useFetchUserPosts(userId, 0);

  const handleOnEndReached = async () => {
    if (!data || !hasMore) return;

    setIsFetchingMore(true);
    try {
      const nextPageNo = pageNo + 1;
      const res = await fetchUserPosts(userId, nextPageNo);
      if (!res || !res.posts.length) {
        setHasMore(false);
      } else {
        queryClient.setQueryData(
          ["author-posts", userId],
          (oldData: { posts: IPost[] } | undefined) => {
            if (!oldData) {
              return { posts: [] };
            }
            const newPostsArray = [...oldData.posts, ...res.posts];
            return { posts: newPostsArray };
          }
        );
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
    return (
      <View className="flex-1 flex-row justify-center items-start z-10 mt-8">
        <LoadingAnimation />
      </View>
    );
  }

  return (
    <View className="">
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
        isFetching={isFetchingMore}
        hasMore={hasMore}
      />
      <View className="flex-grow h-4 mt-16 w-full"></View>
    </View>
  );
};

export default PostsTab;
