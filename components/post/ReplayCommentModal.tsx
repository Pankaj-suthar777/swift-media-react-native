import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";
import Button from "../ui/Button";
import { useQueryClient } from "react-query";
import { useReplayModalStore } from "@/store/replayModalStore";
import moment from "moment";
import useAddReplayCommentMutation from "@/hooks/mutation/useAddReplayCommentMutation";
import useAddReplayToReplyMutation from "@/hooks/mutation/useAddReplayToReplyMutation";

const ReplayCommentModal = () => {
  const [text, setText] = useState("");
  const { isModalOpen, closeModal, Modaltype, comment } = useReplayModalStore();

  const queryClient = useQueryClient();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log("handleSheetChanges", index);
      if (index === -1) {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    if (isModalOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isModalOpen]);

  const {
    mutate: addReplayToComment,
    isLoading: isReplayToCommentLoading,
    isSuccess: isReplayToCommentSuccess,
  } = useAddReplayCommentMutation(comment?.id as number);
  const {
    mutate: addReplayToReplay,
    isLoading: isReplayToReplayLoading,
    isSuccess: isReplayToReplaySuccess,
  } = useAddReplayToReplyMutation();

  const onSubmit = async () => {
    if (!text) return;

    if (Modaltype === "replayToComment") {
      addReplayToComment({ text });
    } else if (Modaltype === "replayToReplayComment") {
      addReplayToReplay({
        text,
        replayToAuthorId: comment?.author_id as number,
        replayToCommentId: comment?.id as number,
      });
    }

    // mutate({ text });
    // queryClient.invalidateQueries(["posts", userInfo?.id]);
  };

  useEffect(() => {
    if (isReplayToReplaySuccess || isReplayToCommentSuccess) {
      setText("");
    }
  }, [isReplayToReplaySuccess, isReplayToCommentSuccess]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Replay</Text>
            <TouchableOpacity
              onPress={() => {
                closeModal();
                setText("");
              }}
              className="justify-center items-center"
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View>
            <View className="flex-row gap-2 items-center">
              <View className="h-8 w-8">
                <Image
                  className="h-full w-full rounded-full"
                  source={
                    comment?.author?.avatar
                      ? { uri: comment.author.avatar }
                      : require("../../assets/images/user-profile2.jpg")
                  }
                />
              </View>
              <Text className="text-md font-semibold text-slate-600">
                {comment?.author.name}
              </Text>
              <Text className="text-xs text-slate-500 pl-2">
                {moment(comment?.created_at).startOf("minutes").fromNow()}
              </Text>
            </View>
            <View className="border-l mt-4 pl-2 py-1 border-slate-500">
              <Text className="text-sm text-gray-800">{comment?.text}</Text>
            </View>
            <View className="px-4 flex-row justify-between items-center border mt-4 border-slate-400">
              <TextInput
                multiline
                className="my-4 text-md max-w-[260px]"
                placeholder="add comment..."
                onChangeText={(e) => setText(e)}
                value={text}
              />
            </View>
            <View style={styles.editorContainer}>
              <Button
                variant="ghost"
                containerClass="h-[40px] justify-center"
                onPress={onSubmit}
                isLoading={
                  Modaltype === "replayToComment"
                    ? isReplayToCommentLoading
                    : isReplayToReplayLoading
                }
              >
                Post
              </Button>
            </View>
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editorContainer: {
    flex: 1,
    marginTop: 8,
  },
});

export default ReplayCommentModal;
