// app/why-lock-in.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { LinearGradient } from 'expo-linear-gradient';

type Reason = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  selected: boolean;
};

export default function WhyLockInScreen() {
  const router = useRouter();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Animation values
  const titleOpacity = useSharedValue(0);
  const card1Opacity = useSharedValue(0);
  const card2Opacity = useSharedValue(0);
  const card3Opacity = useSharedValue(0);
  const card4Opacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);

  useEffect(() => {
    // Stagger animations
    titleOpacity.value = withSpring(1);
    card1Opacity.value = withDelay(200, withSpring(1));
    card2Opacity.value = withDelay(400, withSpring(1));
    card3Opacity.value = withDelay(600, withSpring(1));
    card4Opacity.value = withDelay(800, withSpring(1));
    buttonScale.value = withDelay(1000, withSpring(1));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const card1Style = useAnimatedStyle(() => ({
    opacity: card1Opacity.value,
    transform: [{ translateY: (1 - card1Opacity.value) * 20 }],
  }));

  const card2Style = useAnimatedStyle(() => ({
    opacity: card2Opacity.value,
    transform: [{ translateY: (1 - card2Opacity.value) * 20 }],
  }));

  const card3Style = useAnimatedStyle(() => ({
    opacity: card3Opacity.value,
    transform: [{ translateY: (1 - card3Opacity.value) * 20 }],
  }));

  const card4Style = useAnimatedStyle(() => ({
    opacity: card4Opacity.value,
    transform: [{ translateY: (1 - card4Opacity.value) * 20 }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const toggleReason = (id: string) => {
    setSelectedReasons((prev) =>
      prev.includes(id) ? prev.filter((reasonId) => reasonId !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User is not authenticated');
    }
    setSaving(true);
    try {
      // Save the screen time goal
      await updateDoc(doc(db, 'users', userId), {
        reason: selectedReasons,
      });

      router.push('/how-it-works');
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('Error', 'Failed to save goal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    router.push('/how-it-works');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-16">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center">
          <Text className="text-2xl text-slate-600">←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-base font-bold text-primary-500">Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Progress Dots */}
        <View className="mt-6 flex-row items-center justify-center gap-2">
          <View className="h-2 w-2 rounded-full bg-slate-300" />
          <View className="h-2 w-2 rounded-full bg-slate-300" />
          <View className="h-2 w-2 rounded-full bg-primary-500" />
          <View className="h-2 w-2 rounded-full bg-slate-300" />
          <View className="h-2 w-2 rounded-full bg-slate-300" />
        </View>
        {/* Title */}
        <Animated.View style={titleStyle} className="px-8 pb-8 pt-12">
          <Text className="mb-3 text-center text-3xl font-bold text-slate-900">Why Lock In?</Text>
          <Text className="text-center text-base text-slate-600">
            Help us personalize your experience
          </Text>
          <Text className="mt-2 text-center text-sm text-slate-500">(Select all that apply)</Text>
        </Animated.View>
        {/* Reason Cards */}
        <View className="px-6">
          {/* Card 1 - Study */}
          <Animated.View style={card1Style}>
            <TouchableOpacity
              onPress={() => toggleReason('study')}
              activeOpacity={0.7}
              className={`border-3 mb-4 rounded-2xl p-6 ${
                selectedReasons.includes('study')
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-slate-50'
              }`}>
              <View className="mb-3 flex-row items-center">
                <View
                  className={`mr-4 h-14 w-14 items-center justify-center rounded-2xl ${
                    selectedReasons.includes('study') ? 'bg-primary-100' : 'bg-white'
                  }`}>
                  <Text className="text-4xl">📚</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`mb-1 text-lg font-bold ${
                      selectedReasons.includes('study') ? 'text-primary-900' : 'text-slate-900'
                    }`}>
                    Better Study Habits
                  </Text>
                  <Text
                    className={`text-sm ${
                      selectedReasons.includes('study') ? 'text-primary-700' : 'text-slate-600'
                    }`}>
                    Focus during study sessions
                  </Text>
                </View>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                    selectedReasons.includes('study')
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-slate-300 bg-white'
                  }`}>
                  {selectedReasons.includes('study') && (
                    <Text className="text-xs font-bold text-white">✓</Text>
                  )}
                </View>
              </View>
              <Text
                className={`text-xs leading-5 ${
                  selectedReasons.includes('study') ? 'text-primary-600' : 'text-slate-500'
                }`}>
                Perfect for students who need to stay focused during study sessions and retain more
                information.
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Card 2 - Work */}
          <Animated.View style={card2Style}>
            <TouchableOpacity
              onPress={() => toggleReason('work')}
              activeOpacity={0.7}
              className={`border-3 mb-4 rounded-2xl p-6 ${
                selectedReasons.includes('work')
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-slate-50'
              }`}>
              <View className="mb-3 flex-row items-center">
                <View
                  className={`mr-4 h-14 w-14 items-center justify-center rounded-2xl ${
                    selectedReasons.includes('work') ? 'bg-primary-100' : 'bg-white'
                  }`}>
                  <Text className="text-4xl">💼</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`mb-1 text-lg font-bold ${
                      selectedReasons.includes('work') ? 'text-primary-900' : 'text-slate-900'
                    }`}>
                    Work Productivity
                  </Text>
                  <Text
                    className={`text-sm ${
                      selectedReasons.includes('work') ? 'text-primary-700' : 'text-slate-600'
                    }`}>
                    Deep work sessions with fewer distractions
                  </Text>
                </View>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                    selectedReasons.includes('work')
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-slate-300 bg-white'
                  }`}>
                  {selectedReasons.includes('work') && (
                    <Text className="text-xs font-bold text-white">✓</Text>
                  )}
                </View>
              </View>
              <Text
                className={`text-xs leading-5 ${
                  selectedReasons.includes('work') ? 'text-primary-600' : 'text-slate-500'
                }`}>
                Ideal for enhancing focus during work hours to minimize distractions and maximize
                output.
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Card 3 - Wellness */}
          <Animated.View style={card3Style}>
            <TouchableOpacity
              onPress={() => toggleReason('wellness')}
              activeOpacity={0.7}
              className={`border-3 mb-4 rounded-2xl p-6 ${
                selectedReasons.includes('wellness')
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-slate-50'
              }`}>
              <View className="mb-3 flex-row items-center">
                <View
                  className={`mr-4 h-14 w-14 items-center justify-center rounded-2xl ${
                    selectedReasons.includes('wellness') ? 'bg-primary-100' : 'bg-white'
                  }`}>
                  <Text className="text-4xl">🧘</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`mb-1 text-lg font-bold ${
                      selectedReasons.includes('wellness') ? 'text-primary-900' : 'text-slate-900'
                    }`}>
                    Mental Wellness
                  </Text>
                  <Text
                    className={`text-sm ${
                      selectedReasons.includes('wellness') ? 'text-primary-700' : 'text-slate-600'
                    }`}>
                    Reduce phone addiction and anxiety
                  </Text>
                </View>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                    selectedReasons.includes('wellness')
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-slate-300 bg-white'
                  }`}>
                  {selectedReasons.includes('wellness') && (
                    <Text className="text-xs font-bold text-white">✓</Text>
                  )}
                </View>
              </View>
              <Text
                className={`text-xs leading-5 ${
                  selectedReasons.includes('wellness') ? 'text-primary-600' : 'text-slate-500'
                }`}>
                Step away from constant notifications and social pressure for a calmer, more mindful
                mindset.
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Card 4 - Time */}
          <Animated.View style={card4Style}>
            <TouchableOpacity
              onPress={() => toggleReason('time')}
              activeOpacity={0.7}
              className={`border-3 mb-4 rounded-2xl p-6 ${
                selectedReasons.includes('time')
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-slate-50'
              }`}>
              <View className="mb-3 flex-row items-center">
                <View
                  className={`mr-4 h-14 w-14 items-center justify-center rounded-2xl ${
                    selectedReasons.includes('time') ? 'bg-primary-100' : 'bg-white'
                  }`}>
                  <Text className="text-4xl">⏰</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`mb-1 text-lg font-bold ${
                      selectedReasons.includes('time') ? 'text-primary-900' : 'text-slate-900'
                    }`}>
                    Time Management
                  </Text>
                  <Text
                    className={`text-sm ${
                      selectedReasons.includes('time') ? 'text-primary-700' : 'text-slate-600'
                    }`}>
                    Make better use of your precious time
                  </Text>
                </View>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                    selectedReasons.includes('time')
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-slate-300 bg-white'
                  }`}>
                  {selectedReasons.includes('time') && (
                    <Text className="text-xs font-bold text-white">✓</Text>
                  )}
                </View>
              </View>
              <Text
                className={`text-xs leading-5 ${
                  selectedReasons.includes('time') ? 'text-primary-600' : 'text-slate-500'
                }`}>
                Build better habits around focus and time, helping you stay intentional throughout
                your day.
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        {/* Continue Button */}
        <Animated.View style={buttonStyle} className="mt-8 px-6">
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.8}
            className="overflow-hidden rounded-[30px] shadow-lg">
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ paddingVertical: 20 }}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-lg font-bold text-white">Continue</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
