import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomTextInput from "@/components/ui/TextInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import useUpdatePasswordMutation from "@/hooks/mutation/useUpdatePasswordMutation";
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Password should be at least 6 characters."),
    newPassword: z
      .string()
      .min(6, "new password should be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      oldPassword: "111111",
      newPassword: "123456",
      confirmPassword: "123456",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutate, isLoading, data } = useUpdatePasswordMutation();

  useEffect(() => {
    if (data?.error) {
      setError("root", { message: data.error });
    }
  }, [data]);

  const submitHandler = (values: z.infer<typeof changePasswordSchema>) => {
    mutate({
      newPassword: values.newPassword,
      oldPassword: values.oldPassword,
    });
  };

  return (
    <View>
      <View className="mx-4 mt-4">
        <View className="py-2">
          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextInput
                label="Old Password"
                placeholder="******"
                autoCapitalize="none"
                onChange={onChange}
                value={value}
                errorMsg={errors.oldPassword?.message}
              />
            )}
          />
        </View>
        <View className="py-2">
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextInput
                label="New Password"
                placeholder="******"
                autoCapitalize="none"
                onChange={onChange}
                value={value}
                errorMsg={errors.newPassword?.message}
              />
            )}
          />
        </View>
        <View className="py-2">
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextInput
                label="Confirm Password"
                placeholder="******"
                autoCapitalize="none"
                onChange={onChange}
                value={value}
                errorMsg={errors.confirmPassword?.message}
              />
            )}
          />
        </View>

        {errors?.root ? (
          <View>
            <Text className="text-red-500 text-md">{errors.root.message}</Text>
          </View>
        ) : null}

        <Button
          isLoading={isSubmitting || isLoading}
          onPress={handleSubmit(submitHandler)}
        >
          Save
        </Button>
      </View>
    </View>
  );
};

export default ChangePassword;
