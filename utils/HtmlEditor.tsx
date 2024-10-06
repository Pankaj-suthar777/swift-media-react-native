import React, { useRef } from "react";
import { View } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

interface Props {
  onChange: (e: string | null | undefined) => void;
  value: string | undefined;
}

const HtmlEditor = (props: Props) => {
  const { onChange, value } = props;
  const editor = useRef<RichEditor>(null);

  return (
    <View>
      <RichEditor
        initialContentHTML={value}
        onChange={(e) => onChange(e)}
        ref={editor}
        style={{ flex: 1 }}
        placeholder="Start typing..."
      />
      <RichToolbar editor={editor} actions={["bold", "italic", "underline"]} />
    </View>
  );
};

export default HtmlEditor;
