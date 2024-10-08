import CommentSection from "@/components/post/CommentSection";
import Post from "@/components/post/Post";
import ReplayCommentModal from "@/components/post/ReplayCommentModal";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import { useFetchSinglePost } from "@/hooks/query/postQuery";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PostScreen = () => {
  const navigation = useNavigation();
  const { postId } = useLocalSearchParams();

  const { data, isLoading } = useFetchSinglePost(parseInt(postId as string));

  if (isLoading || !data) {
    return <LoaderFullScreen />;
  }

  return (
    <SafeAreaView className="mt-4 relative">
      <ScrollView className="">
        <View className="px-4 pb-10">
          <View className="flex-row items-center mb-4">
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </Pressable>
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold">Post</Text>
            </View>
          </View>
          <Post post={data?.post} isSinglePost={true} />

          <CommentSection postId={parseInt(postId as string)} />
        </View>
      </ScrollView>
      <ReplayCommentModal />
    </SafeAreaView>
  );
};

export default PostScreen;
