import { ReplayToReplayComment } from "@/@types/ReplyToReply";
import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useAddReplayToReplyMutation = () => {
  const mutation = useMutation(
    async (body: {
      text: string;
      replayToAuthorId: number;
      replayToCommentId: number;
    }) => {
      const client = await getClient();
      const response = await client.post<{
        replayToReplayComment: ReplayToReplayComment;
      }>("/post/add-replay-to-replay", body);
      return response?.data;
    }
  );

  return mutation;
};

export default useAddReplayToReplyMutation;
