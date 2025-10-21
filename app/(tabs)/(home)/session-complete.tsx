import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';

type MoodRating = 'hard' | 'okay' | 'good' | 'amazing';

export default function SessionComplete() {
  const router = useRouter();
  const { duration, xpEarned } = useLocalSearchParams<{
    duration: string;
    xpEarned: string;
  }>();

  const [selectedMood, setSelectedMood] = React.useState<MoodRating | null>(null);

  // Animation values
  const celebrationScale = useSharedValue(0);
  const xpScale = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Start animations
    celebrationScale.value = withSequence(withSpring(1.5), withSpring(1));

    xpScale.value = withDelay(300, withSequence(withSpring(1.1), withSpring(1)));

    progressWidth.value = withDelay(
      600,
      withTiming(68, { duration: 1000, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const celebrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  const xpCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpScale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleMoodSelect = (mood: MoodRating) => {
    setSelectedMood(mood);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Save mood rating to database here
    console.log('Mood selected:', mood);
  };

  const handleDone = () => {
    // Save session data, update streak, etc.
    router.push('/(tabs)/(home)/home');
  };

  const handleStartAnother = () => {
    router.push('/(tabs)/(home)/focus-session');
  };

  const totalXP = Number(xpEarned) || 50;
  const bonusXP = 5; // Streak bonus
  const currentLevel = 12;
  const currentXP = 340;
  const nextLevelXP = 500;
  const progressPercent = Math.floor((currentXP / nextLevelXP) * 100);

  const moods: Array<{
    id: MoodRating;
    emoji: string;

    color: string;
    bgColor: string;
    borderColor: string;
  }> = [
    {
      id: 'hard',
      emoji: '😫',
      color: '#92400e',
      bgColor: '#fef3c7',
      borderColor: '#fbbf24',
    },
    {
      id: 'okay',
      emoji: '😐',
      color: '#92400e',
      bgColor: '#fef3c7',
      borderColor: '#fbbf24',
    },
    {
      id: 'good',
      emoji: '😊',
      color: '#92400e',
      bgColor: '#fef3c7',
      borderColor: '#fbbf24',
    },
    {
      id: 'amazing',
      emoji: '🔥',
      color: '#92400e',
      bgColor: '#fef3c7',
      borderColor: '#fbbf24',
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} autoStart={true} fadeOut={true} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        {/* Celebration Section */}
        <View className="items-center pb-8 pt-16">
          <Animated.View style={celebrationStyle}>
            <Text className="mb-4 text-6xl">🎉</Text>
          </Animated.View>

          <Text className="mb-2 text-3xl font-bold text-slate-900">Great Focus!</Text>
          <Text className="text-sm text-slate-600">
            You have completed {duration} minutes of deep work
          </Text>
        </View>

        {/* Rewards Card */}
        <Animated.View style={xpCardStyle} className="mx-6 mb-5">
          <LinearGradient
            colors={['#10b981', '#059669']} // success-500 to success-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24 }}>
            <View className="rounded-3xl py-6">
              {/* Background decoration */}
              <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white opacity-10" />
              <View className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white opacity-10" />

              <Text className="mb-2 text-center text-base text-white opacity-90">
                Rewards Earned
              </Text>
              <Text className="mb-2 text-center text-6xl font-bold text-white">+{totalXP} XP</Text>

              <Text className="mt-2 text-center text-sm text-white opacity-85">
                +{bonusXP} bonus (7-day streak active!) 🔥
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Progress to Next Level */}
        <View className="mx-6 mb-6 rounded-2xl border-2 border-primary-200 bg-primary-50 p-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-primary-900">Level {currentLevel} Progress</Text>
            <Text className="text-sm font-bold text-primary-600">
              {currentXP}/{nextLevelXP}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="h-3 overflow-hidden rounded-full bg-primary-200">
            <Animated.View style={progressStyle} className="h-3 rounded-full bg-primary-500" />
          </View>

          <Text className="mt-3 text-center text-xs text-primary-900">
            {nextLevelXP - currentXP} XP to Level {currentLevel + 1}! 🎯
          </Text>
        </View>

        {/* Mood Check */}
        <View className="mx-6 mb-6">
          <Text className="mb-4 text-center text-base font-bold text-slate-900">
            How did you feel?
          </Text>

          <View className="flex-row justify-between">
            {moods.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <TouchableOpacity
                  key={mood.id}
                  onPress={() => handleMoodSelect(mood.id)}
                  activeOpacity={0.7}
                  className="items-center">
                  <View
                    className={`h-16 w-16 items-center justify-center rounded-full ${
                      isSelected ? 'border-4' : 'border-2'
                    }`}
                    style={{
                      backgroundColor: isSelected ? '#dcfce7' : mood.bgColor,
                      borderColor: isSelected ? '#22c55e' : mood.borderColor,
                    }}>
                    <Text className="text-4xl">{mood.emoji}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Insights Card (if mood selected) */}
        {selectedMood && (
          <View className="mx-6 mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <Text className="mb-2 text-sm font-bold text-slate-900">💡 Keep it up!</Text>
            <Text className="text-xs leading-5 text-slate-600">
              {selectedMood === 'hard' &&
                "Don't worry! Focus gets easier with practice. Try shorter sessions next time."}
              {selectedMood === 'okay' &&
                "Good effort! You're building the habit. Consistency is key."}
              {selectedMood === 'good' &&
                "Excellent! You're in the zone. Keep this momentum going."}
              {selectedMood === 'amazing' &&
                "You're on fire! 🔥 This is flow state. Try extending your sessions."}
            </Text>
          </View>
        )}

        {/* Quick Stats */}
        <View className="mx-6 mb-6 flex-row gap-3">
          <View className="flex-1 items-center rounded-xl border border-primary-100 bg-primary-50 p-4">
            <Text className="mb-1 text-xs text-primary-600">Sessions Today</Text>
            <Text className="text-2xl font-bold text-primary-900">4</Text>
          </View>

          <View className="flex-1 items-center rounded-xl border border-success-100 bg-success-50 p-4">
            <Text className="mb-1 text-xs text-success-600">Total Time</Text>
            <Text className="text-2xl font-bold text-success-900">2.5h</Text>
          </View>

          <View className="flex-1 items-center rounded-xl border border-warning-100 bg-warning-50 p-4">
            <Text className="mb-1 text-xs text-warning-600">Streak</Text>
            <Text className="text-2xl font-bold text-warning-900">7</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-6 pb-8 pt-4">
        <TouchableOpacity
          onPress={handleDone}
          className="mb-3 h-14 items-center justify-center rounded-[28px] bg-primary-500"
          activeOpacity={0.8}>
          <Text className="text-lg font-bold text-white">Done</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleStartAnother} activeOpacity={0.7}>
          <Text className="text-center text-sm font-bold text-primary-500">
            Start Another Session →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
