import React from "react";
import { Pressable, Text } from "react-native";
import { Image, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { Post as IPost } from "@/@types/post";
import { useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import { Link, router } from "expo-router";
import { useAuthStore } from "@/store/authStore";

import SidePostActions from "./SidePostActions";

const Post = ({
  post,
  isSinglePost = false,
}: {
  post: IPost;
  isSinglePost?: boolean;
}) => {
  const { userInfo } = useAuthStore();
  const { width } = useWindowDimensions();

  return (
    <View
      className={`transition ease-in-out cursor-pointer rounded-xl ${
        isSinglePost ? "p-0" : "p-2 border border-slate-400 bg-slate-50"
      }`}
    >
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
            {post?.author?.avatar ? (
              <Image
                className="w-10 h-10 rounded-full object-cover mr-2"
                source={{
                  uri: post?.author?.avatar,
                }}
              />
            ) : (
              <Image
                className="w-10 h-10 rounded-full object-cover mr-2"
                source={require("../../assets/images/user-profile2.jpg")}
              />
            )}

            <View className="flex justify-between w-full">
              <View className="flex flex-col gap-1">
                <Text className="text-xs">{post?.author?.name}</Text>
                <Text className="text-[10px]">
                  {moment(post?.created_at).startOf("hour").fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </Link>

        {post?.image && (
          <Pressable
            className="mt-4"
            onPress={
              isSinglePost
                ? () => {}
                : () =>
                    router.push({
                      pathname: "/(user)/post/[postId]",
                      params: {
                        postId: post.id,
                      },
                    })
            }
          >
            <Image
              className={`w-full ${
                isSinglePost ? "h-[400px]" : "h-[200px] max-h-[350px]"
              } object-scale-down bg-white rounded-xl`}
              source={{ uri: post?.image }}
            />
          </Pressable>
        )}

        <View className="pt-1 rounded-xl">
          <Pressable
            onPress={
              isSinglePost
                ? () => {}
                : () =>
                    router.push({
                      pathname: "/(user)/post/[postId]",
                      params: {
                        postId: post.id,
                      },
                    })
            }
          >
            <RenderHtml contentWidth={width} source={{ html: post?.text }} />
          </Pressable>
          <SidePostActions post={post} />
        </View>
      </View>
    </View>
  );
};

export default Post;
