import { useMutation } from "react-query";

const useVotePostMutation = ({
  vote,
  id,
}: {
  vote: "up-vote" | "down-vote";
  id: string;
}) => {
  return useMutation({
    mutationFn : 
  })
};

export default useVotePostMutation;

// UpOrDownVote: builder.mutation({
//     query({ vote, id }: { vote: "up-vote" | "down-vote"; id: string }) {
//       return {
//         url: `/post/up-or-down-vote/${id}`,
//         method: "POST",
//         body: { vote },
//       };
//     },
//   }),
