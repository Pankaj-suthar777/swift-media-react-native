import { getFromAsyncStorage, Keys } from "@/utils/asyncStorage";
import { User } from "@/@types/user";
import { Buffer } from "buffer";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

const useCheckTokenValidity = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setUserInfo, setIsLoading } = useAuthStore();

  const checkTokenValidity = async () => {
    const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

    if (token) {
      setIsAuthLoading(true);
      setIsLoading(true);
      try {
        const parts = token
          .split(".")
          .map((part) =>
            Buffer.from(
              part.replace(/-/g, "+").replace(/_/g, "/"),
              "base64"
            ).toString()
          );
        const payload = JSON.parse(parts[1]);

        if (payload && payload.exp) {
          const currentTime = Math.floor(Date.now() / 1000);

          if (payload.exp > currentTime) {
            setUserInfo(payload as User);
            setIsAuthenticated(true);
          } else {
            setUserInfo(null);
          }
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        setUserInfo(null);
      } finally {
        setIsAuthLoading(false);
        setIsLoading(false);
      }
    } else {
      setUserInfo(null);
    }
    setIsAuthLoading(false);
    setIsLoading(false);
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  return {
    isAuthLoading,
    isAuthenticated,
  };
};

export default useCheckTokenValidity;
