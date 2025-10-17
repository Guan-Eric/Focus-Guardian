import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import ToggleSwitch from "../../components/ToggleSwitch";

export default function Home() {
  const [lockedIn, setLockedIn] = useState(false);

  return (
    <View className="flex-1 items-center justify-center bg-gray-950">
      <Text className="text-white text-4xl font-bold mb-8">Lock In</Text>

      <ToggleSwitch
        value={lockedIn}
        onToggle={() => setLockedIn(!lockedIn)}
      />

      <Text className="text-gray-400 mt-6 text-lg">
        {lockedIn ? "You’re locked in 🔒" : "Swipe to lock in your focus"}
      </Text>
    </View>
  );
}
