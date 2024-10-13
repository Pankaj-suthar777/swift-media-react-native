import { ReplyToComment } from "@/@types/replayToComment";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import ReplayToReplayComment from "./ReplayToReplayComment";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useReplayModalStore } from "@/store/replayModalStore";
import { router } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import useToogleReplayCommentVoteMutation from "@/hooks/mutation/post-comment-vote/useToogleReplayCommentVoteMutation";
import { ReplayToCommentVote, VoteType } from "@/@types/vote";

const ReplayComment = ({ comment }: { comment: ReplyToComment }) => {
  const [myVote, setMyVote] = useState<ReplayToCommentVote | undefined>();
  const [commentData, setCommentData] = useState<ReplyToComment>(comment);

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
  const { mutate } = useToogleReplayCommentVoteMutation(comment.id);

  const voteHandler = (vote: VoteType) => {
    mutate({ vote });

    const filteredVoteArray = comment.vote.filter(
      (v) => v.author_id !== userInfo?.id
    );

    const myVote: ReplayToCommentVote = {
      author: userInfo!,
      author_id: userInfo?.id as number,
      created_at: new Date(),
      id: Math.floor(1000 * Math.random() + 10),
      reply_to_comment: comment,
      reply_to_comment_id: comment.id,
      vote,
    };
    setMyVote(myVote);

    const modifiedVoteArray: ReplayToCommentVote[] = [
      ...filteredVoteArray,
      myVote,
    ];

    const modifiedComment: ReplyToComment = {
      ...comment,
      vote: modifiedVoteArray,
    };

    setCommentData(modifiedComment);
  };

  return (
    <View className="my-2 ml-2 border-l-2 border-gray-300 pl-2">
      <View className="flex-row gap-2 items-center">
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
          className="h-8 w-8"
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
                  type: "replayToReplayComment",
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
                {commentData?.vote?.filter((v) => v.vote === "up-vote").length}
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
                {
                  commentData?.vote?.filter((v) => v.vote === "down-vote")
                    .length
                }
              </Text>
            </View>
          </View>
        </View>
      </View>
      {comment.replies?.length > 0 && (
        <View className="ml-2 mt-2">
          {comment.replies.map((reply, index) => (
            <ReplayToReplayComment key={index} comment={reply} />
          ))}
        </View>
      )}
    </View>
  );
};

export default ReplayComment;
