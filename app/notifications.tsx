// app/onboarding/notifications.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';

export default function NotificationsScreen() {
  const router = useRouter();
  const [requesting, setRequesting] = useState(false);

  const requestNotificationPermission = async () => {
    setRequesting(true);

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        // Navigate to next screen
        router.push('/paywall');
      } else {
        Alert.alert('Notifications Disabled', 'You can enable them later in settings', [
          { text: 'OK', onPress: () => router.push('/paywall') },
        ]);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setRequesting(false);
    }
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
      </View>

      {/* Progress Dots */}
      <View className="mt-6 flex-row items-center justify-center gap-2">
        <View className="h-2 w-2 rounded-full bg-slate-300" />
        <View className="h-2 w-2 rounded-full bg-slate-300" />
        <View className="h-2 w-2 rounded-full bg-slate-300" />
        <View className="h-2 w-2 rounded-full bg-slate-300" />
        <View className="h-2 w-2 rounded-full bg-primary-500" />
      </View>

      {/* Content */}
      <View className="flex-1 items-center px-8 pt-12">
        <Text className="mb-3 text-center text-3xl font-bold text-slate-900">Stay on track</Text>
        <Text className="mb-16 text-center text-base text-slate-600">
          Get helpful reminders to maintain focus
        </Text>

        {/* Bell Icon */}
        <View className="relative mb-16 h-32 w-32 items-center justify-center rounded-full bg-primary-100">
          <Text className="text-6xl">🔔</Text>
          {/* Notification badge */}
          <View className="absolute right-6 top-6 h-8 w-8 items-center justify-center rounded-full bg-accent-500">
            <Text className="text-sm font-bold text-white">3</Text>
          </View>
        </View>

        {/* Permission Cards */}
        <View className="mb-8 w-full">
          <View className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <Text className="mb-2 text-base font-bold text-slate-900">🔔 Daily Check-ins</Text>
            <Text className="text-sm leading-5 text-slate-600">
              Remind you to log your progress and maintain your streak
            </Text>
          </View>

          <View className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <Text className="mb-2 text-base font-bold text-slate-900">⏰ Focus Reminders</Text>
            <Text className="text-sm leading-5 text-slate-600">
              Session start/end notifications and milestone celebrations
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={requestNotificationPermission}
          activeOpacity={0.9}
          disabled={requesting}
          className="mb-4 overflow-hidden rounded-[30px] shadow-lg">
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingVertical: 20 }}>
            <Text className="text-center text-lg font-bold text-white">
              {requesting ? 'Enabling...' : 'Enable Notifications'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/paywall')}>
          <Text className="text-center text-sm text-slate-500">I'll do this later</Text>
        </TouchableOpacity>

        <Text className="mt-4 text-center text-xs text-slate-400">
          🔒 Your data is private and secure
        </Text>
      </View>
    </View>
  );
}
