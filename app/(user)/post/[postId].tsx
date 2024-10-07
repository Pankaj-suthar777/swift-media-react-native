import Comment from "@/components/post/Comment";
import Post from "@/components/post/Post";
import Loader from "@/components/ui/Loader";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import {
  useFetchSinglePost,
  useFetchSinglePostComment,
} from "@/hooks/query/postQuery";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// export const commentsData = [
//   {
//     id: 1,
//     text: "This is the first comment.",
//     replies: [
//       {
//         id: 2,
//         text: "This is a reply to the first comment.",
//         replies: [
//           {
//             id: 3,
//             text: "This is a nested reply.",
//             replies: [],
//           },
//         ],
//       },
//       {
//         id: 4,
//         text: "Another reply to the first comment.",
//         replies: [],
//       },
//     ],
//   },
//   {
//     id: 5,
//     text: "This is another top-level comment.",
//     replies: [],
//   },
// ];

const PostScreen = () => {
  const navigation = useNavigation();
  const { postId } = useLocalSearchParams();

  const { data, isLoading } = useFetchSinglePost(parseInt(postId as string));
  const { data: commentData, isLoading: commentIsLoading } =
    useFetchSinglePostComment(parseInt(postId as string));

  if (isLoading || !data) {
    return <LoaderFullScreen />;
  }

  return (
    <SafeAreaView className="mt-4">
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

          {commentIsLoading ? (
            <Loader />
          ) : (
            <View className="mt-4">
              {commentData?.comments.map((comment, index) => (
                <Comment key={index} comment={comment} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostScreen;
