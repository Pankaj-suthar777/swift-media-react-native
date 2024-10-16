import { Notification } from "@/@types/notifiction";
import { User } from "@/@types/user";
import { getClient } from "@/api/client";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";

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

interface FetchSearchUserResponse {
  email: string;
  id: number;
  name: string;
  avatar: null | string;
  about: null | string;
}

export const fetchSearchUser = async (
  searchValue: string
): Promise<FetchSearchUserResponse[]> => {
  const client = await getClient();
  const response = await client.get(`/user/search-user?search=${searchValue}`);
  return response.data;
};

export const useFetchSearchUser = (searchValue: string) => {
  const [debouncedSearchValue] = useDebounce(searchValue, 700);

  return useQuery({
    queryKey: ["searched-user", debouncedSearchValue],
    queryFn: () => fetchSearchUser(debouncedSearchValue),
    enabled: debouncedSearchValue.length > 0,
  });
};

export interface People {
  id: number;
  name: string;
  email: string;
  avatar: null | string;
  about: null | string;
  isFollowing?: boolean;
}

export const fetchAllUser = async (): Promise<{ peoples: People[] }> => {
  const client = await getClient();
  const response = await client.get("/user/get-peoples");
  return response.data;
};

export const useFetchAllUser = () => {
  return useQuery({
    queryKey: ["all-user"],
    queryFn: fetchAllUser,
  });
};

export const fetchUserFollowingList = async (
  id: number
): Promise<{
  following: People[];
}> => {
  const client = await getClient();
  const response = await client.get(`/user/get-following-list/${id}`);
  return response.data;
};

export const useFetchUserFollowingList = (id: number) => {
  return useQuery({
    queryKey: ["following-list", id],
    queryFn: () => fetchUserFollowingList(id),
  });
};

export const fetchUserFollowersList = async (
  id: number
): Promise<{
  followers: People[];
}> => {
  const client = await getClient();
  const response = await client.get(`/user/get-followers-list/${id}`);
  return response.data;
};

export const useFetchUserFollowersList = (id: number) => {
  return useQuery({
    queryKey: ["follower-list", id],
    queryFn: () => fetchUserFollowersList(id),
  });
};

export const fetchIsFollow = async (id: number): Promise<boolean> => {
  const client = await getClient();
  const response = await client.get(`/user/is-follow/${id}`);
  return response.data;
};

export const useFetchIsFollow = (id: number) => {
  return useQuery({
    queryKey: ["is-follow", id],
    queryFn: () => fetchIsFollow(id),
  });
};

export const fetchMyNotificationsCount = async () => {
  const client = await getClient();
  const response = await client.get<{ notificationsCount: number }>(
    "/user/get-notification-count"
  );
  return response.data;
};

export const useFetchMyNotificationsCountQuery = () => {
  return useQuery({
    queryKey: ["notifictions-count"],
    queryFn: fetchMyNotificationsCount,
  });
};

export const fetchMyNotifications = async () => {
  const client = await getClient();
  const response = await client.get<{ notifications: Notification[] }>(
    "/user/get-notification"
  );
  return response.data;
};

export const useFetchMyNotifications = () => {
  return useQuery({
    queryKey: ["notifictions"],
    queryFn: fetchMyNotifications,
  });
};
