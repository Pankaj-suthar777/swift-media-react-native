import { ReactNode, useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import Feather from "@expo/vector-icons/Feather";

interface Props {
  label?: string;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean;
  rightIcon?: ReactNode;
  onRightIconPress?(): void;
  errorMsg?: string;
  onChange?: ((text: string) => void) | undefined;
  value?: string | undefined;
  iconLabel?: React.ReactNode;
}

const CustomTextInput = (props: Props) => {
  const {
    label,
    placeholder,
    autoCapitalize,
    keyboardType,
    secureTextEntry = false,
    errorMsg,
    onChange,
    value,
    iconLabel,
  } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);
  const inputTransformValue = useSharedValue(0);

  const shakeUI = () => {
    inputTransformValue.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withSpring(0, {
        damping: 8,
        mass: 0.5,
        stiffness: 1000,
        restDisplacementThreshold: 0.1,
      })
    );
  };

  const inputStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: inputTransformValue.value,
        },
      ],
    };
  });

  useEffect(() => {
    if (errorMsg) {
      shakeUI();
    }
  }, [errorMsg]);

  return (
    <Animated.View style={[inputStyles]} className="w-full">
      {label && <ThemedText style={{ fontWeight: "bold" }}>{label}</ThemedText>}
      <View className="flex-row w-full justify-between items-center border border-gray-300 rounded-md p-2 my-2">
        <TextInput
          className="flex-1"
          value={value}
          onChangeText={onChange}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={isPasswordVisible}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            className="ml-2"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={18}
              color="gray"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {errorMsg ? (
        <View className="px-2">
          <Text className="text-red-500">{errorMsg}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
};

export default CustomTextInput;
