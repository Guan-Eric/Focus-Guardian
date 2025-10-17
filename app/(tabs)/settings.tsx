import { View, Text } from "react-native";

export default function Settings() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-950">
      <Text className="text-white text-3xl font-bold">Settings</Text>
      <Text className="text-gray-400 mt-2">App preferences will appear here.</Text>
    </View>
  );
}
