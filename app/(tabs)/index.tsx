// import Button from "@/components/ui/Button";
// import { useAuthStore } from "@/store/authStore";
// import { clearAsyncStorage } from "@/utils/asyncStorage";
// import { router } from "expo-router";
// import React from "react";
// import { View } from "react-native";

// const onPress = () => {
//   router.navigate("/(auth)/login");
// };

// const Home = () => {
//   const { logout } = useAuthStore();
//   const logoutHandler = () => {
//     logout();
//     clearAsyncStorage();
//   };

//   return (
//     <View className="justify-center items-center flex-1">
//       <Button onPress={onPress}>Go to login</Button>
//       <Button onPress={logoutHandler}>Logout</Button>
//     </View>
//   );
// };

// export default Home;
import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POSTS = [
  {
    id: 1,
    avatar: "https://www.bootdey.com/img/Content/avatar/avatar2.png",
    name: "React Native",
    date: "Jan 1, 2021",
    image: "https://www.bootdey.com/image/280x280/40E0D0/000000",
    description:
      "Happy New Year! ðŸŽ‰ 2021 is going to be an amazing year for React Native!",
    likes: 122,
    shares: 32,
  },
  {
    id: 2,
    avatar: "https://www.bootdey.com/img/Content/avatar/avatar8.png",
    name: "Node.js",
    date: "Dec 31, 2020",
    image: "https://www.bootdey.com/image/280x280/DB7093/000000",
    description:
      "Ending the year with a bang! ðŸŽ† Thank you to all our amazing community members for your support in 2020. We can't wait to see what you build in 2021 with Node.js!",
    likes: 243,
    shares: 77,
  },
  {
    id: 1,
    avatar: "https://www.bootdey.com/img/Content/avatar/avatar2.png",
    name: "React Native",
    date: "Jan 1, 2021",
    image: "https://www.bootdey.com/image/280x280/40E0D0/000000",
    description:
      "Happy New Year! ðŸŽ‰ 2021 is going to be an amazing year for React Native!",
    likes: 122,
    shares: 32,
  },
  {
    id: 2,
    avatar: "https://www.bootdey.com/img/Content/avatar/avatar8.png",
    name: "Node.js",
    date: "Dec 31, 2020",
    image: "https://www.bootdey.com/image/280x280/DB7093/000000",
    description:
      "Ending the year with a bang! ðŸŽ† Thank you to all our amazing community members for your support in 2020. We can't wait to see what you build in 2021 with Node.js!",
    likes: 243,
    shares: 77,
  },
  {
    id: 1,
    avatar: "https://www.bootdey.com/img/Content/avatar/avatar2.png",
    name: "React Native",
    date: "Jan 1, 2021",
    image: "https://www.bootdey.com/image/280x280/40E0D0/000000",
    description:
      "Happy New Year! ðŸŽ‰ 2021 is going to be an amazing year for React Native!",
    likes: 122,
    shares: 32,
  },
  {
    id: 2,
    avatar: "https://www.bootdey.com/img/Content/avatar/avatar8.png",
    name: "Node.js",
    date: "Dec 31, 2020",
    image: "https://www.bootdey.com/image/280x280/DB7093/000000",
    description:
      "Ending the year with a bang! ðŸŽ† Thank you to all our amazing community members for your support in 2020. We can't wait to see what you build in 2021 with Node.js!",
    likes: 243,
    shares: 77,
  },
  // ...
];

const HomeScreen = () => {
  return (
    <SafeAreaView>
      <FlatList
        data={POSTS}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.header}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{ height: 200, width: "100%" }}
              />
            )}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
                <Text style={styles.actionText}>Like</Text>
                <Text style={styles.actionCount}>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
                <Text style={styles.actionText}>Share</Text>
                <Text style={styles.actionCount}>{item.shares}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  post: {
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#808080",
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  date: {
    fontSize: 14,
    color: "gray",
    marginLeft: 10,
  },
  description: {
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: 18,
    color: "#3b5998",
  },
  actionCount: {
    fontSize: 18,
    marginLeft: 5,
  },
});

export default HomeScreen;
