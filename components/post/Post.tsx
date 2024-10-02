import React, { useState } from "react";
import { Text } from "react-native";
import { Image, TouchableOpacity, View } from "react-native";
import moment from "moment";
import Entypo from "@expo/vector-icons/Entypo";
import { Post as IPost } from "@/@types/post";
import { useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

const Post = ({ post }: { post: IPost }) => {
  const isSaved = true;
  const { width } = useWindowDimensions();

  return (
    <View className="bg-slate-50 border border-slate-400 transition ease-in-out cursor-pointer rounded-xl p-2">
      <View className="">
        <View className="items-center flex-row">
          {/* User Avatar */}
          <TouchableOpacity>
            <Image
              className="w-10 h-10 rounded-full object-cover mr-2"
              source={{ uri: post?.author?.avatar || "/user-profile2.jpg" }}
            />
          </TouchableOpacity>
          {/* Post Author and Time */}
          <View className="flex justify-between w-full">
            <TouchableOpacity className="flex flex-col gap-1">
              <Text className="text-xs">posted by: {post?.author?.name}</Text>
              <Text className="text-[10px]">
                Created At: {moment(post?.created_at).startOf("hour").fromNow()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

          {/* Post Footer */}
          {/* Save Button */}
        </View>
      </View>
    </View>
  );
};

export default Post;

const SidePostActions = ({ post }: { post: IPost }) => {
  return (
    <View className="flex-row">
      {/* Upvote Section */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          className={`border rounded-full border-slate-300 p-2 bg-green-200`}
        >
          <Entypo name="arrow-up" size={20} />
        </TouchableOpacity>
        <Text>{post?.vote.filter((v) => v.vote === "up-vote").length}</Text>
      </View>

      {/* Downvote Section */}
      <View className="flex-row items-center gap-2 ml-2">
        <TouchableOpacity
          className={`border rounded-full border-slate-300 p-2 bg-red-200`}
        >
          <Entypo name="arrow-down" size={20} />
        </TouchableOpacity>
        <Text>{post?.vote.filter((v) => v.vote === "down-vote").length}</Text>
      </View>
    </View>
  );
};
