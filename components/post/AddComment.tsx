import { Comment } from "@/@types/comment";
import useAddCommentMutation from "@/hooks/mutation/useAddCommentMutation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useQueryClient } from "react-query";

interface Props {
  postId: number;
}

const AddComment = ({ postId }: Props) => {
  const [text, setText] = useState("");

  const { mutate, data, isLoading } = useAddCommentMutation(postId);
  const querClient = useQueryClient();
  const { userInfo } = useAuthStore();

  const submitHandler = () => {
    if (!text) return;
    mutate({ text });
  };

  useEffect(() => {
    if (data?.success) {
      setText("");
      querClient.setQueryData(
        ["post-comment", postId],
        (oldData: { comments: Comment[] } | undefined) => {
          const newCommentsArray: Comment[] = [
            ...(oldData?.comments || []),
            data.comment,
          ];

          return { comments: newCommentsArray };
        }
      );
    }
  }, [data]);
  return (
    <View className="px-4 flex-row justify-between items-center">
      <TextInput
        multiline
        className="my-4 text-md max-w-[260px]"
        placeholder="add comment..."
        onChangeText={(e) => setText(e)}
        value={text}
      />
      {text ? (
        <TouchableOpacity
          className={`px-3 items-center justify-center h-6 ${
            isLoading ? "bg-slate-400" : "bg-slate-800"
          } rounded-lg`}
          onPress={isLoading ? () => {} : submitHandler}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text className="text-xs text-white">Add</Text>
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default AddComment;
