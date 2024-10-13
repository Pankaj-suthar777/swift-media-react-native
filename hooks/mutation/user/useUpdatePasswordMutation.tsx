import { getClient } from "@/api/client";
import { useMutation } from "react-query";

const useUpdatePasswordMutation = () => {
  const mutation = useMutation(
    async (body: { newPassword: string; oldPassword: string }) => {
      const client = await getClient();
      const response = await client.post("/auth/update-password", body);
      return response?.data;
    }
  );

  return mutation;
};

export default useUpdatePasswordMutation;
