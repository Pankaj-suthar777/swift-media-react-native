import { ReplayToReplayComment as IReplayToReplayComment } from "@/@types/ReplyToReply";
import { ReplayToReplyCommentVote, VoteType } from "@/@types/vote";
import useToogleReplayoReplyCommentVoteMutation from "@/hooks/mutation/post-comment-vote/useToogleReplayoReplyCommentVoteMutation";
import { useAuthStore } from "@/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";

const ReplayToReplayComment = ({
  comment,
}: {
  comment: IReplayToReplayComment;
}) => {
  const [myVote, setMyVote] = useState<ReplayToReplyCommentVote | undefined>();
  const [commentData, setCommentData] =
    useState<IReplayToReplayComment>(comment);

  useEffect(() => {
    if (comment) {
      const initialMyVote = comment.replayToReplyCommentVote.find(
        (vote) => vote.author_id === userInfo?.id
      );
      setMyVote(initialMyVote);
    }
  }, [comment]);

  const { userInfo } = useAuthStore();
  const { mutate } = useToogleReplayoReplyCommentVoteMutation(comment.id);

  const voteHandler = (vote: VoteType) => {
    mutate({
      vote,
    });

    const filteredVoteArray = comment.replayToReplyCommentVote.filter(
      (v) => v.author_id !== userInfo?.id
    );

    const myVote: ReplayToReplyCommentVote = {
      author: userInfo!,
      author_id: userInfo?.id as number,
      created_at: new Date(),
      id: Math.floor(1000 * Math.random() + 10),
      vote,
      reply_to_reply_comment: comment,
      reply_to_reply_comment_id: comment.id,
    };
    setMyVote(myVote);

    const modifiedVoteArray: ReplayToReplyCommentVote[] = [
      ...filteredVoteArray,
      myVote,
    ];

    const modifiedComment: IReplayToReplayComment = {
      ...comment,
      replayToReplyCommentVote: modifiedVoteArray,
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
                {
                  commentData?.replayToReplyCommentVote?.filter(
                    (v) => v.vote === "up-vote"
                  ).length
                }
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
                  commentData?.replayToReplyCommentVote?.filter(
                    (v) => v.vote === "down-vote"
                  ).length
                }
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReplayToReplayComment;
