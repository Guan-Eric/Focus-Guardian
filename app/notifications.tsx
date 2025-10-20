import { View, Text, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Link, useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();

  const requestPermission = async () => {
    await Notifications.requestPermissionsAsync();
    router.push('/paywall');
  };

  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <Text className="mb-4 text-3xl font-bold text-white">Stay on Track</Text>
      <Text className="mb-10 text-center text-gray-400">
        Enable notifications to remind you when it’s time to focus again.
      </Text>
      <TouchableOpacity
        onPress={requestPermission}
        className="mb-4 rounded-xl bg-purple-600 px-8 py-3">
        <Text className="font-semibold text-white">Enable Notifications</Text>
      </TouchableOpacity>
      <Link href="/paywall" asChild>
        <TouchableOpacity>
          <Text className="text-gray-400 underline">Skip for now</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
