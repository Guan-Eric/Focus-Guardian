import { View, Text, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";
import { Link, useRouter } from "expo-router";

export default function NotificationsScreen() {
  const router = useRouter();

  const requestPermission = async () => {
    await Notifications.requestPermissionsAsync();
    router.push("/(onboarding)/paywall");
  };

  return (
    <View className="flex-1 justify-center items-center bg-black px-8">
      <Text className="text-3xl font-bold text-white mb-4">Stay on Track</Text>
      <Text className="text-gray-400 text-center mb-10">
        Enable notifications to remind you when it’s time to focus again.
      </Text>
      <TouchableOpacity
        onPress={requestPermission}
        className="bg-purple-600 px-8 py-3 rounded-xl mb-4"
      >
        <Text className="text-white font-semibold">Enable Notifications</Text>
      </TouchableOpacity>
      <Link href='/paywall' asChild>
        <TouchableOpacity>
          <Text className="text-gray-400 underline">Skip for now</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
