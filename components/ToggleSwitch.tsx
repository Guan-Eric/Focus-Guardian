import { Pressable, View, Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function ToggleSwitch({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const translateX = useRef(new Animated.Value(value ? 24 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 24 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <Pressable
      onPress={onToggle}
      className={`w-16 h-9 rounded-full p-1 ${value ? "bg-purple-600" : "bg-gray-700"}`}
    >
      <Animated.View
        style={{ transform: [{ translateX }] }}
        className="w-7 h-7 bg-white rounded-full"
      />
    </Pressable>
  );
}
