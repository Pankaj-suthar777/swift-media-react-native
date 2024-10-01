import { User } from "@/@types/user";
import { create } from "zustand";

type Store = {
  userInfo: User | null;
  setUserInfo: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<Store>()((set) => ({
  userInfo: null,
  setUserInfo: (user) => set(() => ({ userInfo: user })),
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn: isLoggedIn })),
  isLoading: false,
  setIsLoading: (loading) => set(() => ({ isLoading: loading })),
  logout: () =>
    set(() => ({ userInfo: null, isLoading: false, isLoggedIn: false })),
}));
