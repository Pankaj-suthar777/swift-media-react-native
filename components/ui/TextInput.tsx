import { ReactNode, useEffect } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../ThemedText";

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
    secureTextEntry,
    errorMsg,
    onChange,
    value,
    iconLabel,
  } = props;

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
      {label && <ThemedText className="mb-2">{label}</ThemedText>}
      <TextInput
        className="border border-gray-300 rounded-md p-2 my-2 w-full"
        value={value}
        onChangeText={onChange}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {errorMsg ? (
        <View className="px-2">
          <Text className="text-red-500">{errorMsg}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
};

export default CustomTextInput;
