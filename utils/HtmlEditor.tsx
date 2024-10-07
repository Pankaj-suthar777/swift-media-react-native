import React, { useRef } from "react";
import { View } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

interface Props {
  onChange: (e: string | null | undefined) => void;
  value?: string;
  richEditorStyles?: string;
  selectedIconTint?: string;
}

const HtmlEditor = (props: Props) => {
  const { onChange, value, richEditorStyles } = props;
  const editor = useRef<RichEditor>(null);

  return (
    <View style={{ flex: 1 }}>
      <RichEditor
        initialContentHTML={value}
        onChange={(e) => onChange(e)}
        ref={editor}
        style={{ flex: 1, height: 200, width: "100%" }}
        placeholder="Start typing..."
        className={richEditorStyles}
      />
      <RichToolbar
        editor={editor}
        actions={["bold", "italic", "underline", "unorderedList"]}
        selectedIconTint={"#2095F2"}
      />
    </View>
  );
};

export default HtmlEditor;
