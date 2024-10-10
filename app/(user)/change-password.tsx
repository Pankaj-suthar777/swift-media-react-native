import { View, Text } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import CustomTextInput from "@/components/ui/TextInput";
import { z } from "zod";
const editProfileSchema = z.object({
  oldPassword: z.string().min(6, "Password should be at least 6 characters."),
  newPassword: z
    .string()
    .min(6, "new password should be at least 6 characters."),
  confirmPassword: z.string(),
});

const ChangePassword = () => {
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
  return (
    <View>
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
      </View>{" "}
    </View>
  );
};

export default ChangePassword;
