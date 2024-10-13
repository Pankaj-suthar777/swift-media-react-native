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
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import useCreatePostMutation from "@/hooks/mutation/post/useCreatePostMutation";
import { uploadFilesToFirebaseAndGetUrl } from "@/utils/file-upload";
import { AntDesign } from "@expo/vector-icons";
import Button from "../ui/Button";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import * as ImagePicker from "expo-image-picker";
import RadioGroup from "react-native-radio-buttons-group";
import { useQueryClient } from "react-query";
import { useAuthStore } from "@/store/authStore";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePostModal = ({ isOpen, setIsOpen }: Props) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [visibility, setVisibility] = useState("2");
  const queryClient = useQueryClient();

  const { userInfo } = useAuthStore();

  const { mutate, isLoading } = useCreatePostMutation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const editor = useRef<RichEditor>(null);

  const snapPoints = useMemo(() => ["70%"], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log("handleSheetChanges", index);
      if (index === -1) {
        setIsOpen(false);
      }
    },
    [setIsOpen]
  );

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const onSubmit = async () => {
    if (!text || !image) {
      return;
    }

    let visibilityValue;
    visibility === "1"
      ? (visibilityValue = "PUBLIC")
      : (visibilityValue = "ONLY_FOLLOWING");

    try {
      setIsImageLoading(true);
      const body: any = { text, visibility: visibilityValue };
      if (image) {
        const imageUrl = await uploadFilesToFirebaseAndGetUrl(image, "posts");
        body.image = imageUrl;
      }
      mutate(body);
      queryClient.invalidateQueries(["posts", userInfo?.id]);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsImageLoading(false);
      setIsOpen(false);
    }
  };

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const radioButtons = useMemo(
    () => [
      {
        id: "1",
        label: "PUBLIC",
        value: "PUBLIC",
      },
      {
        id: "2",
        label: "ONLY FOLLOWING",
        value: "ONLY_FOLLOWING",
      },
    ],
    []
  );

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
            <Text style={styles.headerTitle}>Create Post</Text>
            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                setImage("");
                setText("");
              }}
              className="justify-center items-center"
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.editorContainer}>
              <RichEditor
                initialContentHTML={text}
                onChange={(e) => setText(e)}
                ref={editor}
                placeholder="Start typing..."
              />
              <RichToolbar
                editor={editor}
                actions={["bold", "italic", "underline", "unorderedList"]}
              />

              <Pressable
                onPress={handleImageChange}
                className="h-[150px] w-[150px] bg-slate-200 justify-center items-center rounded-md mt-2"
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <>
                    <AntDesign name="plus" size={24} />
                    <Text className="font-semibold text-xs">Add Image</Text>
                  </>
                )}
              </Pressable>
              <View className="h-[90px] py-4 items-start">
                <RadioGroup
                  containerStyle={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flex: 1,
                  }}
                  radioButtons={radioButtons}
                  onPress={(e: any) => setVisibility(e)}
                  selectedId={visibility}
                />
              </View>
              <Button
                variant="default"
                containerClass="h-[40px] justify-center"
                onPress={onSubmit}
                isLoading={isLoading || isImageLoading}
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

export default CreatePostModal;
