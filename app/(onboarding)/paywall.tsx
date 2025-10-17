import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Paywall() {
  const router = useRouter();

  const upgrade = async () => {
    // Placeholder for RevenueCat logic
    router.replace("/(tabs)");
    await AsyncStorage.setItem("onboardingSeen", "true");

  };

  return (
    <View className="flex-1 bg-black px-8 justify-center items-center">
      <Text className="text-4xl font-bold text-white mb-2">Go Pro 🚀</Text>
      <Text className="text-gray-400 text-center mb-8">
        Unlock premium themes, XP boosts, and full focus stats.
      </Text>

      <View className="w-full space-y-3">
        <TouchableOpacity
          onPress={upgrade}
          className="bg-purple-600 py-4 rounded-2xl items-center"
        >
          <Text className="text-white text-lg font-semibold">Start Free Trial</Text>
          <Text className="text-gray-300 text-sm mt-1">$3.99/month after trial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.setItem("onboardingSeen", "true");
            router.replace("/(tabs)");
          }}
          className="border border-gray-600 py-4 rounded-2xl items-center mt-2"
        >
          <Text className="text-gray-300 font-medium">Continue with Free Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
