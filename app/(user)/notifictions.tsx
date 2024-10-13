import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useFetchMyNotifications } from "@/hooks/query/userQuery";
import LoaderFullScreen from "@/components/ui/LoaderFullScreen";
import moment from "moment";
import useSeenNotificationMutation from "@/hooks/mutation/notifiction/useSeenNotificationMutation";
import EmptyRecords from "@/components/ui/EmptyRecords";

const NotifictionsScreen = () => {
  const { data, isLoading } = useFetchMyNotifications();
  const { mutate } = useSeenNotificationMutation();
  useEffect(() => {
    if (data && data?.notifications.length > 0) {
      mutate();
    }
  }, []);
  if (isLoading) {
    return <LoaderFullScreen />;
  }

  return (
    <View>
      <FlatList
        ListEmptyComponent={
          <View className="mt-4">
            <EmptyRecords title="No notifictions" />
          </View>
        }
        data={data?.notifications}
        renderItem={({ item }) => {
          return (
            <View
              className={`flex-row h-[70px] items-center px-4 ${
                item.isSeen ? "bg-white" : "bg-green-200"
              } rounded-lg shadow-md border border-gray-200`}
            >
              <Image
                source={
                  item?.image
                    ? { uri: item.image }
                    : require("../../assets/images/user-profile2.jpg")
                }
                className="h-[50px] w-[50px] object-cover rounded-full"
              />
              <View className="ml-3 flex-1">
                <View className="mb-1 flex-row justify-between items-center">
                  <Text className="text-md font-semibold">
                    {item.user.name}
                  </Text>
                  <Text className="text-md text-gray-500">
                    {moment(item.created_at).startOf("hour").fromNow()}
                  </Text>
                </View>
                <Text className="text-xs text-gray-700">{item.message}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default NotifictionsScreen;

const styles = StyleSheet.create({});
