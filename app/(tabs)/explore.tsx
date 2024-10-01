import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const friends = [
  {
    id: "1",
    name: "John Parker",
    country: "Canada",
    age: "21-30 Years old",
    rating: 3,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar1.png",
  },
  {
    id: "2",
    name: "John Parker",
    country: "Canada",
    age: "21-30 Years old",
    rating: 4,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar2.png",
  },
  {
    id: "3",
    name: "John Parker",
    country: "Canada",
    age: "21-30 Years old",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar3.png",
  },
  {
    id: "4",
    name: "John Parker",
    country: "Canada",
    age: "21-30 Years old",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar4.png",
  },
  {
    id: "5",
    name: "John Parker",
    country: "Canada",
    age: "21-30 Years old",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://bootdey.com/img/Content/avatar/avatar5.png",
  },
];

const FriendListScreen = () => {
  const renderFriend = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>
            {item.country} - {item.age}
          </Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Text key={index} style={styles.star}>
                {index < Math.floor(item.rating) ? "★" : "☆"}
              </Text>
            ))}
          </View>
          <Text style={styles.sports}>{item.sports.join(" | ")}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Unfriend</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fbfbfb",
    borderWidth: 2,
    borderColor: "#DCDCDC",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 16,
    color: "#FFD700",
  },
  sports: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2ECC71",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#2ECC71",
    fontSize: 16,
  },
});

export default FriendListScreen;
