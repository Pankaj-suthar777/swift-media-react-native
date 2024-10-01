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
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { setUserInfo, setIsLoggedIn } = useAuthStore();
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log("yo");

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
    <View className="bg-white items-center justify-center">
      <View className="h-1/2 w-full">
        <ImageBackground
          source={{
            uri: "https://www.bootdey.com/image/580x580/20B2AA/20B2AA",
          }}
          className="w-full h-full justify-center items-center"
        >
          <View>
            <Text className="text-2xl font-bold text-white">
              My Awesome App
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View className="bg-white rounded-lg shadow-lg p-5 w-11/12 h-1/2 items-center">
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
        <Button
          variant="outline"
          isLoading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          Login
        </Button>
        <Button
          variant="link"
          onPress={() => router.navigate("/(auth)/register")}
        >
          Create Account
        </Button>
        <TouchableOpacity className="mt-5"></TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
