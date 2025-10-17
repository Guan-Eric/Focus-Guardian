import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function HowItWorks() {
  return (
    <View className="flex-1 justify-center items-center bg-black px-8">
      <Text className="text-3xl font-bold text-white mb-4">How It Works</Text>
      <Text className="text-gray-400 text-center mb-10">
        Start focus sessions. Each minute gives you XP.  
        Level up as you build consistent focus streaks.
      </Text>
      <View className="flex-row gap-4">
        <Link href="/(onboarding)/welcome" asChild>
          <TouchableOpacity className="border border-gray-500 px-6 py-3 rounded-xl">
            <Text className="text-gray-300">Back</Text>
          </TouchableOpacity>
        </Link>
        <Link href='/notifications' asChild>
          <TouchableOpacity className="bg-purple-600 px-8 py-3 rounded-xl">
            <Text className="text-white font-semibold">Next</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
