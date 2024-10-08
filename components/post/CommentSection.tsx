import { useFetchSinglePostComment } from "@/hooks/query/postQuery";
import { View } from "react-native";
import AddComment from "./AddComment";
import Loader from "../ui/Loader";
import Comment from "./Comment";

interface Props {
  postId: number;
}

const CommentSection = ({ postId }: Props) => {
  const { data: commentData, isLoading: commentIsLoading } =
    useFetchSinglePostComment(postId);
  return (
    <View>
      {commentIsLoading ? (
        <Loader />
      ) : (
        <View className="mt-4">
          <AddComment postId={postId} />
          {commentData?.comments.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))}
        </View>
      )}
    </View>
  );
};

export default CommentSection;
