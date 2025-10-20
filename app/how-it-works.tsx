import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HowItWorks() {
  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <Text className="mb-4 text-3xl font-bold text-white">How It Works</Text>
      <Text className="mb-10 text-center text-gray-400">
        Start focus sessions. Each minute gives you XP. Level up as you build consistent focus
        streaks.
      </Text>
      <View className="flex-row gap-4">
        <Link href="/welcome" asChild>
          <TouchableOpacity className="rounded-xl border border-gray-500 px-6 py-3">
            <Text className="text-gray-300">Back</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/notifications" asChild>
          <TouchableOpacity className="rounded-xl bg-purple-600 px-8 py-3">
            <Text className="font-semibold text-white">Next</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
