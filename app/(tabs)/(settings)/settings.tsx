import { View, Text } from 'react-native';

export default function Settings() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <Text className="text-3xl font-bold text-white">Settings</Text>
      <Text className="mt-2 text-gray-400">App preferences will appear here.</Text>
    </View>
  );
}
