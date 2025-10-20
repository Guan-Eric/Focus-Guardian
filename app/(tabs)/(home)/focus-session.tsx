import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ToggleSwitch from '../../../components/ToggleSwitch';
import ExitButton from '../../../components/ExitButton';

export default function FocusSession() {
  const durations = [15, 25, 50];
  const [index, setIndex] = useState(1);
  const [duration, setDuration] = useState(25);
  const [isFocused, setIsFocused] = useState(false);

  const handleDurationChange = (selectedIndex: number, duration: number) => {
    setIndex(selectedIndex);
    setDuration(duration);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1 items-center bg-slate-50 px-6">
        {/* Header */}
        <View className="w-full flex-row justify-between">
          <Text className="text-3xl font-bold text-slate-800">Focus Session</Text>
          <ExitButton onPress={() => router.back()} />
        </View>

        {/* Timer Selector */}
        <View className="mb-8 mt-10 items-center">
          <Text className="text-base text-slate-500">Choose your focus time</Text>

          <View className="mt-4 flex-row justify-center">
            {durations.map((min, idx) => (
              <Pressable
                key={min}
                onPress={() => handleDurationChange(idx, min)}
                className={`mx-3 rounded-2xl border-4 px-5 py-5 ${
                  index === idx
                    ? 'border-primary-600 bg-primary-100'
                    : 'border-slate-300 bg-slate-100'
                }`}>
                <Text
                  className={`text-center text-3xl font-bold ${index === idx ? 'text-primary-600' : 'text-slate-700'}`}>
                  {min}
                </Text>
                <Text className={` ${index === idx ? 'text-primary-600' : 'text-slate-700'}`}>
                  minutes
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => handleDurationChange(3, 0)} // Assume 30 minutes for custom time
            className={`mx-3 mt-4 rounded-2xl border-4 px-5 py-3 ${
              index === 3 ? 'border-primary-600 bg-primary-100' : 'border-slate-300 bg-slate-100'
            }`}>
            <Text className={`${index === 3 ? 'text-primary-600' : 'text-slate-700'}`}>Custom</Text>
          </Pressable>
        </View>

        {/* XP Preview */}
        <View className="mb-12 items-center rounded-3xl border border-2 border-success-200 bg-success-50 px-12 py-4">
          <Text className="text-lg font-bold text-success-700">You’ll earn</Text>
          <Text className="mt-1 text-4xl font-bold text-success-600">+{duration} XP</Text>
          <Text className="mt-1 text-sm text-slate-400 text-success-700">
            Plus streak bonus if completed
          </Text>
        </View>

        {/* Start Button */}
        <ToggleSwitch
          onToggle={() => router.push({ pathname: '/(tabs)/(home)/timer', params: { duration } })}
        />

        {/* Footer / Motivation */}
        <Text className="mt-8 px-6 text-center text-sm text-slate-500">
          Stay consistent! Each minute builds your focus streak.
        </Text>
      </SafeAreaView>
    </View>
  );
}
