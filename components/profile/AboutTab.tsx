import { User } from "@/@types/user";
import { Text, View } from "react-native";
import RenderHTML from "react-native-render-html";

const AboutTab = ({ about = "", width }: { about: string; width: number }) => (
  <View className="p-5 bg-gray-100 rounded-lg mx-4 mb-2 mt-4">
    <Text className="text-lg font-bold mb-3">About</Text>
    <RenderHTML
      contentWidth={width}
      source={{ html: about || "<p>No information available</p>" }}
    />
  </View>
);

export default AboutTab;
