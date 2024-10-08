import Button from "@/components/ui/Button";
import CustomTextInput from "@/components/ui/TextInput";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Keys, saveToAsyncStorage } from "@/utils/asyncStorage";
import client from "@/api/client";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password should be at least 6 characters."),
});

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "qwert@gmail.com",
      password: "123456",
    },
    resolver: zodResolver(loginSchema),
  });

  const { setUserInfo, setIsLoggedIn, userInfo } = useAuthStore();
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await client.post("/auth/login", {
        ...values,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);

      setUserInfo(data.userInfo);
      setIsLoggedIn(true);
      router.replace("/(tabs)/");
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.detail;
      //   Toast.show({
      //     type: "error",
      //     text1: errorMessage,
      //   });
    }
  };

  return (
    <View className="bg-white flex-1 items-center justify-center">
      <View className="bg-white rounded-lg  -lg p-5 w-11/12 items-center">
        <Text className="text-3xl font-bold mb-12">Swift Media</Text>
        <Controller
          control={control}
          name={"email"}
          render={({ field: { value, onChange, onBlur } }) => (
            <CustomTextInput
              placeholder="Email"
              autoCapitalize={"none"}
              onChange={onChange}
              value={value}
              errorMsg={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={"password"}
          render={({ field: { value, onChange, onBlur } }) => (
            <CustomTextInput
              placeholder="Password"
              secureTextEntry={true}
              autoCapitalize={"none"}
              onChange={onChange}
              value={value}
              errorMsg={errors.password?.message}
            />
          )}
        />

        <TouchableOpacity className="w-full text-right">
          <Text className="text-teal-400 text-xs font-bold text-right">
            Forgot?
          </Text>
        </TouchableOpacity>
        <Button isLoading={isSubmitting} onPress={handleSubmit(onSubmit)}>
          Login
        </Button>

        <Button
          variant="link"
          onPress={() => router.navigate("/(auth)/register")}
        >
          Create Account
        </Button>
        <View className="mt-3 mb-6 h-[1px] w-full bg-slate-200"></View>
        <Button variant="outline" textClass="font-normal">
          Continue with Google
        </Button>
        <Button variant="outline" textClass="font-normal">
          Continue with Facebook
        </Button>
      </View>
    </View>
  );
};

export default LoginScreen;
