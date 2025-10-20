import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-5xl font-extrabold text-white">Lock In</Text>
      <Text className="mb-10 text-center text-gray-300">
        Build focus. Earn XP. Beat distractions.
      </Text>
      <Link href="/how-it-works" asChild>
        <TouchableOpacity className="rounded-2xl bg-purple-600 px-8 py-4">
          <Text className="text-lg font-semibold text-white">Get Started</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
