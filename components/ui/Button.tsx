import React, { useEffect } from "react";
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/Feather";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface Props {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "disabled" | "link" | "secondary";
  isLoading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  containerClass?: string;
  textClass?: string;
}

const variantStyles = {
  default: {
    container: "p-2 mt-3 w-full items-center rounded-md bg-teal-400",
    text: "text-white font-bold",
  },
  secondary: {
    container: "p-2 mt-3 w-full items-center rounded-md  bg-green-100",
    text: "text-green-600 text-center font-medium",
  },
  outline: {
    container:
      "p-2 mt-3 w-full items-center rounded-md bg-slate-200 hover:bg-slate-400",
    text: "text-slate-800 font-medium",
  },
  ghost: {
    container:
      "p-2 mt-3 w-full items-center rounded-md bg-transparent border border-teal-400",
    text: "text-teal-400 font-bold",
  },
  disabled: {
    container: "p-2 mt-3 w-full items-center rounded-md bg-gray-400",
    text: "text-gray-200 font-bold",
  },
  link: {
    container: "p-2 mt-3",
    text: "text-teal-400 text-xs font-bold",
  },
};

const Button = ({
  children,
  variant = "default",
  isLoading = false,
  onPress,
  containerClass,
  textClass,
}: Props) => {
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  useEffect(() => {
    if (isLoading) {
      rotate.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1
      );
    } else {
      rotate.value = 0;
    }
  }, [isLoading]);

  const { container, text } = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={isLoading ? () => {} : onPress}
      className={`${container} ${containerClass}`}
      disabled={variant === "disabled" || isLoading}
    >
      {isLoading ? (
        <Animated.View style={animatedStyle}>
          <Icon name="loader" size={18} />
        </Animated.View>
      ) : (
        <Text className={`${text} ${textClass}`}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
