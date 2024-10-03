import { User } from "@/@types/user";
import { getClient } from "@/api/client";
import { useQuery } from "react-query";

interface FetchUserResponse {
  user: User;
  totalPosts: number;
}

export const fetchUser = async (userId: number): Promise<FetchUserResponse> => {
  const client = await getClient();
  const response = await client.get(`/user/${userId}`);
  return response.data;
};

export const useFetchUser = (userId: number) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });
};
