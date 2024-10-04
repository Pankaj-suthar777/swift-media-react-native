import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ComponentProps } from "react";
import { IconProps } from "@expo/vector-icons/build/createIconSet";

// Define props for the icon component, including the ability to pass a custom icon component
type TabBarIconProps = {
  name: string; // Generalize 'name' as a string since each icon set has different names
  IconComponent?: any; // Allow any icon component
  size?: number; // Optionally allow size override
  color?: string; // Optionally allow color override
  style?: object; // Allow additional styles
};

// TabBarIcon component with flexibility to accept a different icon set
export function TabBarIcon({
  name,
  size = 28,
  color = "black",
  style,
  IconComponent = AntDesign, // Default to AntDesign
  ...rest
}: TabBarIconProps) {
  return (
    <IconComponent
      // @ts-ignore
      name={name} // Use the provided name (now flexible)
      size={size}
      color={color}
      style={[{ marginBottom: -3 }, style]}
      {...rest}
    />
  );
}
