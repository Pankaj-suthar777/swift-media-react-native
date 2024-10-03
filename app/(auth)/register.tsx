import Button from "@/components/ui/Button";
import CustomTextInput from "@/components/ui/TextInput";
import React from "react";
import { Text, View, ImageBackground, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Keys, saveToAsyncStorage } from "@/utils/asyncStorage";
import client from "@/api/client";
import { useAuthStore } from "@/store/authStore";

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, { message: "name is required" }),
  password: z.string().min(6, "Password should be at least 6 characters."),
});

const RegisterScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const { setUserInfo, setIsLoggedIn } = useAuthStore();
  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const { data } = await client.post("/auth/login", {
        ...values,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);

      setUserInfo(data.userInfo);
      setIsLoggedIn(true);
      router.replace("/(tabs)/");
    } catch (error: any) {
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
          name={"name"}
          render={({ field: { value, onChange, onBlur } }) => (
            <CustomTextInput
              placeholder="Name"
              autoCapitalize={"none"}
              onChange={onChange}
              value={value}
              errorMsg={errors.name?.message}
            />
          )}
        />
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

        <Button isLoading={isSubmitting} onPress={handleSubmit(onSubmit)}>
          Create Account
        </Button>
        <Button variant="link" onPress={() => router.navigate("/(auth)/login")}>
          Login
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

export default RegisterScreen;
