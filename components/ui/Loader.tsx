import Icon from "@expo/vector-icons/Feather";
import { useEffect } from "react";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { View, StyleSheet } from "react-native";

const Loader = ({ size = 20 }: { size?: number }) => {
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );

    return () => {
      rotate.value = 0;
    };
  }, [rotate]);

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, styles.loader]}>
        <Icon name="loader" size={size} color="#000" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
