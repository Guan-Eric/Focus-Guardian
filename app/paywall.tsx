import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Paywall() {
  const router = useRouter();

  const upgrade = async () => {
    // Placeholder for RevenueCat logic
    router.replace('/(tabs)/(home)/home');
    await AsyncStorage.setItem('onboardingSeen', 'true');
  };

  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <Text className="mb-2 text-4xl font-bold text-white">Go Pro 🚀</Text>
      <Text className="mb-8 text-center text-gray-400">
        Unlock premium themes, XP boosts, and full focus stats.
      </Text>

      <View className="w-full space-y-3">
        <TouchableOpacity onPress={upgrade} className="items-center rounded-2xl bg-purple-600 py-4">
          <Text className="text-lg font-semibold text-white">Start Free Trial</Text>
          <Text className="mt-1 text-sm text-gray-300">$3.99/month after trial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.setItem('onboardingSeen', 'true');
            router.replace('/(tabs)/(home)/home');
          }}
          className="mt-2 items-center rounded-2xl border border-gray-600 py-4">
          <Text className="font-medium text-gray-300">Continue with Free Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
