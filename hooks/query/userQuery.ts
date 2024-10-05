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

import { useState, useEffect } from "react";

interface FetchSearchUserResponse {
  avatar?: string;
  email: string;
  id: number;
  name: string;
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
  isFollowing: boolean;
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
