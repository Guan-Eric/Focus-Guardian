import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Welcome() {
  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Text className="text-5xl font-extrabold text-white mb-4">Lock In</Text>
      <Text className="text-gray-300 text-center mb-10">
        Build focus. Earn XP. Beat distractions.
      </Text>
      <Link href='/how-it-works' asChild>
        <TouchableOpacity className="bg-purple-600 px-8 py-4 rounded-2xl">
          <Text className="text-white font-semibold text-lg">Get Started</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
