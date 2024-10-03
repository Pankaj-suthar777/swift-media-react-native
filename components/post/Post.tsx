import React, { useState } from "react";
import { Text } from "react-native";
import { Image, TouchableOpacity, View } from "react-native";
import moment from "moment";
import Entypo from "@expo/vector-icons/Entypo";
import { Post as IPost } from "@/@types/post";
import { useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import { Link } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { VoteType } from "@/@types/vote";

const Post = ({ post }: { post: IPost }) => {
  const { userInfo } = useAuthStore();
  const isSaved = true;
  const { width } = useWindowDimensions();
  return (
    <View className="bg-slate-50 border border-slate-400 transition ease-in-out cursor-pointer rounded-xl p-2">
      <View className="">
        <Link
          className="z-10"
          href={
            userInfo?.id !== post.authorId
              ? {
                  pathname: "/profile/[userId]",
                  params: { userId: post.authorId },
                }
              : { pathname: "/(tabs)/profile" }
          }
        >
          <View className="items-center flex-row">
            {/* User Avatar */}

            <Image
              className="w-10 h-10 rounded-full object-cover mr-2"
              source={{ uri: post?.author?.avatar || "/user-profile2.jpg" }}
            />
            {/* Post Author and Time */}
            <View className="flex justify-between w-full">
              <View className="flex flex-col gap-1">
                <Text className="text-xs">posted by: {post?.author?.name}</Text>
                <Text className="text-[10px]">
                  Created At:{" "}
                  {moment(post?.created_at).startOf("hour").fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </Link>
        {/* Post Image */}
        {post?.image && (
          <TouchableOpacity className="mt-4">
            <Image
              className={`w-full h-[200px] object-scale-down bg-white rounded-xl`}
              source={{ uri: post?.image }}
            />
          </TouchableOpacity>
        )}

        <View className="pt-1 rounded-xl">
          <RenderHtml contentWidth={width} source={{ html: post?.text }} />
          <View className="flex-row w-full justify-between">
            <SidePostActions post={post} />

            <View className="flex-row items-center justify-end">
              <TouchableOpacity
                className={`flex-row items-center border border-slate-300 rounded-full py-1 px-3 ${
                  isSaved ? "bg-slate-300" : ""
                }`}
                //   onPress={savePostHandler}
              >
                {/* {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : ( */}
                <Entypo size={18} name="pin" />
                {/* )} */}
                <Text className="ml-2">{post?.savedPost?.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity className="mx-2">
                <Entypo size={18} name="share" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Post;

const SidePostActions = ({ post }: { post: IPost }) => {
  const [vote, setVote] = useState<{ vote: VoteType | undefined }>();

  return (
    <View className="flex-row">
      {/* Upvote Section */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          className={`border rounded-full border-slate-300 p-2 ${
            vote?.vote === "up-vote" ? "bg-green-200" : ""
          }`}
        >
          <Entypo name="arrow-up" size={20} />
        </TouchableOpacity>
        <Text>{post?.vote.filter((v) => v.vote === "up-vote").length}</Text>
      </View>

      {/* Downvote Section */}
      <View className="flex-row items-center gap-2 ml-2">
        <TouchableOpacity
          className={`border rounded-full border-slate-300 p-2 ${
            vote?.vote === "down-vote" ? "bg-red-200" : ""
          }`}
        >
          <Entypo name="arrow-down" size={20} />
        </TouchableOpacity>
        <Text>{post?.vote.filter((v) => v.vote === "down-vote").length}</Text>
      </View>
    </View>
  );
};
