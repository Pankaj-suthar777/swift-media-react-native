import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { getClient } from "@/api/client";
import CustomTextInput from "@/components/ui/TextInput";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import Button from "@/components/ui/Button";
import { uploadFilesToFirebaseAndGetUrl } from "@/utils/file-upload";
import HtmlEditor from "@/utils/HtmlEditor";

const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

const EditScreen = () => {
  const { setUserInfo, userInfo } = useAuthStore();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: userInfo?.name || "",
    },
    resolver: zodResolver(editProfileSchema),
  });

  const [about, setAbout] = useState(userInfo?.about || "");
  const [profileImage, setProfileImage] = useState(userInfo?.avatar || null);
  const [backgroundImage, setBackgroundImage] = useState(
    userInfo?.backgroundImage || null
  );

  // Function to handle profile image change
  const handleProfileImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Function to handle background image change
  const handleBackgroundImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setBackgroundImage(result.assets[0].uri);
    }
  };

  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    try {
      const client = await getClient();

      let avatarUrl;
      let backgroundImageUrl;

      if (profileImage && profileImage !== userInfo?.avatar) {
        avatarUrl = profileImage
          ? await uploadFilesToFirebaseAndGetUrl(profileImage, "avatar")
          : undefined;
      }

      if (backgroundImage && backgroundImage !== userInfo?.backgroundImage) {
        backgroundImageUrl = backgroundImage
          ? await uploadFilesToFirebaseAndGetUrl(
              backgroundImage,
              "backgroundImage"
            )
          : undefined;
      }

      const { data } = await client.put("/auth/update-user-info", {
        ...values,
        ...(about && { about: about }),
        ...(backgroundImageUrl && { backgroundImage: backgroundImageUrl }),
        ...(avatarUrl && { avatar: avatarUrl }),
      });

      setUserInfo(data.user);
      navigation.goBack();
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <SafeAreaView className="mt-4">
      <ScrollView>
        <View className="flex-row items-center mb-4 px-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </Pressable>
          <View className="flex-1 ml-4">
            <Text className="text-lg font-bold">Edit Profile</Text>
          </View>
        </View>
        <ImageBackground
          source={
            backgroundImage
              ? { uri: backgroundImage }
              : require("../../assets/images/image3.jpg")
          }
          className="w-full h-48 justify-center"
        >
          <View className="items-center relative">
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../../assets/images/user-profile2.jpg")
              }
              style={styles.profileImage}
            />

            <Pressable
              className="h-12 w-12 bg-black rounded-full justify-center items-center absolute bottom-4 right-32"
              onPress={handleProfileImageChange}
            >
              <Feather name="edit-3" size={22} color={"white"} />
            </Pressable>
          </View>
          <Pressable
            className="h-8 w-8 bg-black justify-center items-center absolute top-2 right-2"
            onPress={handleBackgroundImageChange}
          >
            <Feather name="edit-3" size={18} color={"white"} />
          </Pressable>
        </ImageBackground>

        <View className="mx-4 mt-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextInput
                label="Name"
                placeholder="Enter your name"
                autoCapitalize="none"
                onChange={onChange}
                value={value}
                errorMsg={errors.name?.message}
              />
            )}
          />
        </View>

        <View className="mx-4 mt-4">
          <Text className="text-sm font-semibold mb-2">About</Text>
          <HtmlEditor value={userInfo?.about} onChange={(e) => setAbout(e)} />
        </View>

        <View className="mx-4 mt-8">
          <Button isLoading={isSubmitting} onPress={handleSubmit(onSubmit)}>
            Save
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 10,
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
});
