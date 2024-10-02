// import React from "react";
// import { Text, View } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";

// // Define a type for ReactNode
// type ReactNode = React.ReactNode;

// const mapTagToComponent = (
//   tag: string,
//   children: ReactNode,
//   key: number
// ): ReactNode => {
//   switch (tag) {
//     case "h3":
//       return (
//         <Text className="text-2xl font-bold my-2" key={key}>
//           {children}
//         </Text>
//       );
//     case "p":
//       return (
//         <Text className="text-base my-2" key={key}>
//           {children}
//         </Text>
//       );
//     case "ul":
//       return (
//         <View className="my-2" key={key}>
//           {children}
//         </View>
//       );
//     case "li":
//       return (
//         <Text className="text-base my-1" key={key}>
//           • {children}
//         </Text>
//       );
//     case "strong":
//       return (
//         <Text className="font-bold" key={key}>
//           {children}
//         </Text>
//       );
//     default:
//       return <Text key={key}>{children}</Text>;
//   }
// };

// // Type for the function that converts HTML-like strings to React Native components
// const htmlToReactNative = (htmlString: string): ReactNode[] => {
//   const regex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
//   const stack: (string | number)[] = [];
//   let currentIndex = 0;
//   let result: ReactNode[] = [];

//   let match: RegExpExecArray | null;
//   while ((match = regex.exec(htmlString)) !== null) {
//     const tag = match[1];
//     const isClosingTag = match[0].startsWith("</");
//     const previousText = htmlString.substring(currentIndex, match.index);

//     // Add the text before the current tag
//     if (previousText.trim()) {
//       result.push(previousText);
//     }

//     if (isClosingTag) {
//       // Pop the top element from the stack and map to component
//       const children = result.splice(stack.pop() as number, result.length);
//       const openingTag = stack.pop() as string;
//       result.push(mapTagToComponent(openingTag, children, result.length));
//     } else {
//       // Push the tag to the stack
//       stack.push(result.length); // Push the current position
//       stack.push(tag); // Push the tag itself
//     }

//     currentIndex = regex.lastIndex;
//   }

//   // Add any remaining text
//   const remainingText = htmlString.substring(currentIndex);
//   if (remainingText.trim()) {
//     result.push(remainingText);
//   }

//   return result;
// };
