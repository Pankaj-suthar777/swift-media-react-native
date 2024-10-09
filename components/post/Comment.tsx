import { Comment as IComment } from "@/@types/comment";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import ReplayComment from "./ReplayComment";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useReplayModalStore } from "@/store/replayModalStore";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import useToogleCommentVoteMutation from "@/hooks/mutation/useToogleCommentVoteMutation";
import { CommentVote, VoteType } from "@/@types/vote";
import { useQueryClient } from "react-query";

const Comment = ({ comment }: { comment: IComment }) => {
  const [myVote, setMyVote] = useState<CommentVote | undefined>();

  useEffect(() => {
    if (comment) {
      const initialMyVote = comment.vote.find(
        (vote) => vote.author_id === userInfo?.id
      );
      setMyVote(initialMyVote);
    }
  }, [comment]);

  const { setModal } = useReplayModalStore();
  const { userInfo } = useAuthStore();
  const { mutate } = useToogleCommentVoteMutation(comment.id);
  const queryClient = useQueryClient();
  const voteHandler = (vote: VoteType) => {
    mutate({ vote });

    queryClient.setQueryData(
      ["post-comment", comment.post_id],
      (oldData: { comments: IComment[] } | undefined) => {
        if (!oldData) {
          return { comments: [] };
        }

        const votedCommentIndex = oldData.comments.findIndex(
          (c) => c.id === comment.id
        );

        if (votedCommentIndex === -1) {
          return oldData; // Return old data if the comment isn't found
        }

        const votedComment = oldData.comments[votedCommentIndex];

        const myVote: CommentVote = {
          author_id: userInfo?.id as number,
          created_at: new Date(),
          id: Math.floor(1000 * Math.random() + 10),
          vote,
          comment_id: comment.id,
          comment,
        };

        setMyVote(myVote);

        const filterCommentVotesArray = votedComment.vote.filter(
          (v) => v.author_id !== userInfo?.id
        );

        const newCommentsVotes: CommentVote[] = [
          ...filterCommentVotesArray,
          myVote,
        ];

        // Create a modified comment
        const modifiedComment: IComment = {
          ...votedComment,
          vote: newCommentsVotes,
        };

        // Return new comments array with the modified comment at the correct index
        const updatedComments = [...oldData.comments];
        updatedComments[votedCommentIndex] = modifiedComment;

        return {
          comments: updatedComments,
        };
      }
    );
  };

  return (
    <View className="my-2 ml-2 border-l-2 border-gray-300 pl-2">
      <View className="flex-row gap-2 items-center">
        <TouchableOpacity
          className="h-8 w-8"
          onPress={() =>
            router.push(
              userInfo?.id !== comment.author_id
                ? {
                    pathname: "/profile/[userId]",
                    params: { userId: comment.author_id },
                  }
                : { pathname: "/(tabs)/profile" }
            )
          }
        >
          <Image
            className="h-full w-full rounded-full"
            source={
              comment.author?.avatar
                ? { uri: comment.author.avatar }
                : require("../../assets/images/user-profile2.jpg")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push(
              userInfo?.id !== comment.author_id
                ? {
                    pathname: "/profile/[userId]",
                    params: { userId: comment.author_id },
                  }
                : { pathname: "/(tabs)/profile" }
            )
          }
        >
          <Text className="text-md font-semibold text-slate-600">
            {comment.author.name}
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-slate-500 pl-2">
          {moment(comment.created_at).startOf("minutes").fromNow()}
        </Text>
      </View>
      <View>
        <Text className="mt-1 text-sm text-gray-800">{comment.text}</Text>
        <View className="flex-row justify-end items-center">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="flex-row items-center mx-4"
              onPress={() =>
                setModal({
                  open: true,
                  type: "replayToComment",
                  comment: comment,
                })
              }
            >
              <MaterialCommunityIcons
                color={"black"}
                name="arrow-left-top"
                size={18}
              />
              <Text className="text-sm font-semibold ml-2 text-slate-600">
                Replay
              </Text>
            </TouchableOpacity>
            <View className="flex-row items-center mx-3">
              <Pressable
                className={`rounded-full border p-1 border-slate-500 ${
                  myVote?.vote === "up-vote" ? "bg-green-200" : ""
                }`}
                onPress={() => voteHandler("up-vote")}
              >
                <AntDesign name="arrowup" size={16} color={"black"} />
              </Pressable>
              <Text className="ml-3">
                {comment?.vote?.filter((v) => v.vote === "up-vote").length}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Pressable
                className={`rounded-full border p-1 border-slate-500 ${
                  myVote?.vote === "down-vote" ? "bg-red-200" : ""
                }`}
                onPress={() => voteHandler("down-vote")}
              >
                <AntDesign name="arrowdown" size={16} color={"black"} />
              </Pressable>
              <Text className="ml-2">
                {comment?.vote?.filter((v) => v.vote === "down-vote").length}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {comment.replayedComment?.length > 0 && (
        <View className="ml-2 mt-2">
          {comment.replayedComment.map((reply, index) => (
            <ReplayComment key={index} comment={reply} />
          ))}
        </View>
      )}
    </View>
  );
};

export default Comment;
