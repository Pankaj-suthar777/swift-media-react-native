import React, { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Post as IPost } from "@/@types/post";
import { useAuthStore } from "@/store/authStore";
import { VoteType } from "@/@types/vote";
import useVotePostMutation from "@/hooks/mutation/post/useVotePostMutation";
import { useQueryClient } from "react-query";
import useSavePostMutation from "@/hooks/mutation/post/useSavePostMutation";
import { Share } from "react-native";

const SidePostActions = ({ post }: { post: IPost }) => {
  const { userInfo } = useAuthStore();

  const myVote = post.vote.find((vote) => vote.author_id === userInfo?.id);

  const [vote, setVote] = useState<VoteType>();

  useEffect(() => {
    setVote(myVote?.vote);
  }, [myVote]);

  const queryClient = useQueryClient();

  const { mutate } = useVotePostMutation({ id: post.id });

  const voteHandler = async (v: VoteType) => {
    if (!v) return;

    setVote(v);

    mutate({ vote: v });

    queryClient.setQueryData(
      ["feed-posts"],
      (oldData: { posts: IPost[] } | undefined) => {
        if (!oldData || oldData.posts.length === 0) {
          return { posts: [] };
        }
        return {
          posts: oldData.posts.map((p) => {
            if (p.id === post.id) {
              const filteredVote = p.vote.filter(
                (vote) => vote.author_id !== userInfo?.id
              );
              filteredVote.push({
                author_id: userInfo?.id as number,
                created_at: new Date(),
                vote: v,
                id: Math.floor(Math.random() * 532),
                post_id: post.id,
              });
              return { ...p, vote: filteredVote };
            }
            return p;
          }),
        };
      }
    );
    queryClient.setQueryData(
      ["posts", post.authorId],
      (oldData: { posts: IPost[] } | undefined) => {
        if (!oldData || oldData.posts.length === 0) {
          return { posts: [] };
        }
        return {
          posts: oldData.posts.map((p) => {
            if (p.id === post.id) {
              const filteredVote = p.vote.filter(
                (vote) => vote.author_id !== userInfo?.id
              );
              filteredVote.push({
                author_id: userInfo?.id as number,
                created_at: new Date(),
                vote: v,
                id: Math.floor(Math.random() * 273),
                post_id: post.id,
              });
              return { ...p, vote: filteredVote };
            }
            return p;
          }),
        };
      }
    );
    // queryClient.invalidateQueries(["posts", post.authorId]);
  };

  const { mutate: postSaveMutate } = useSavePostMutation({ id: post.id });

  const postSaveHandler = () => {
    postSaveMutate();
    setIsSaved(!isSaved);
    setSavedPostNum(isSaved ? savedPostNum - 1 : savedPostNum + 1);
  };

  // Share post handler
  const sharePostHandler = async () => {
    try {
      const postLink = `https://swift-rivals-mern.vercel.app/user/posts/${post.id}`;

      const result = await Share.share({
        message: `Check out this post from ${post.author.name}: ${postLink}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while trying to share the post.");
    }
  };

  const [isSaved, setIsSaved] = useState(false);
  const [savedPostNum, setSavedPostNum] = useState(0);

  useEffect(() => {
    if (post?.savedPost) {
      const isSaved = post?.savedPost?.find(
        (p) => p.author_id === userInfo?.id
      );
      setIsSaved(isSaved ? true : false);
      setSavedPostNum(post?.savedPost.length);
    }
  }, [post, userInfo?.id]);

  return (
    <View className="flex-row w-full justify-between mt-2">
      <View className="flex-row">
        {/* Upvote Section */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className={`border rounded-full border-slate-300 p-2 ${
              vote === "up-vote" ? "bg-green-200" : ""
            }`}
            onPress={() => voteHandler("up-vote")}
          >
            <Entypo name="arrow-up" size={20} />
          </TouchableOpacity>
          <Text>{post?.vote.filter((v) => v.vote === "up-vote").length}</Text>
        </View>

        <View className="flex-row items-center gap-2 ml-2">
          <TouchableOpacity
            className={`border rounded-full border-slate-300 p-2 ${
              vote === "down-vote" ? "bg-red-200" : ""
            }`}
            onPress={() => voteHandler("down-vote")}
          >
            <Entypo name="arrow-down" size={20} />
          </TouchableOpacity>
          <Text>{post?.vote.filter((v) => v.vote === "down-vote").length}</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-end">
        <TouchableOpacity
          className={`flex-row items-center border border-slate-300 rounded-full py-2 px-3 ${
            isSaved ? "bg-slate-300" : ""
          }`}
          onPress={postSaveHandler}
        >
          <Entypo size={18} name="pin" />
          <Text className="ml-2">{savedPostNum}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mx-2" onPress={sharePostHandler}>
          <Entypo size={18} name="share" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SidePostActions;
