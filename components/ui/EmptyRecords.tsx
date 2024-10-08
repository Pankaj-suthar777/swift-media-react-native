import React, { FC } from "react";
import { View, StyleSheet, Text } from "react-native";

interface Props {
  title: string;
}

const EmptyRecords: FC<Props> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

export default EmptyRecords;
