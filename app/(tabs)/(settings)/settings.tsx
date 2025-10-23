// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function ProfileScreen() {
  const { userData, user, signOut, linkEmail } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState(userData?.settings?.notifications ?? true);
  const [dailyCheckIn, setDailyCheckIn] = useState(userData?.settings?.dailyCheckIn ?? true);

  const handleToggleNotifications = async (value: boolean) => {
    setNotifications(value);
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        'settings.notifications': value,
      });
    }
  };

  const handleToggleDailyCheckIn = async (value: boolean) => {
    setDailyCheckIn(value);
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        'settings.dailyCheckIn': value,
      });
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/welcome');
        },
      },
    ]);
  };

  const handleLinkAccount = () => {
    Alert.prompt(
      'Link Email',
      'Enter your email to save your progress permanently',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: (email?: string) => {
            if (email && email.length > 0) {
              Alert.prompt(
                'Create Password',
                'Choose a password (min 6 characters)',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Link Account',
                    onPress: async (password?: string) => {
                      if (password && password.length >= 6) {
                        try {
                          await linkEmail(email, password);
                          Alert.alert('Success', 'Account linked successfully!');
                        } catch (error: any) {
                          Alert.alert('Error', error.message);
                        }
                      } else {
                        Alert.alert('Error', 'Password must be at least 6 characters');
                      }
                    },
                  },
                ],
                'secure-text'
              );
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pb-4 pt-16">
          <Text className="text-2xl font-bold text-slate-900">Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="mx-6 mb-6">
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 20, padding: 24 }}>
            {/* Avatar */}
            <View className="mb-4 items-center">
              <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-white">
                <Text className="text-5xl">{userData?.titleEmoji || '🌱'}</Text>
              </View>
              <Text className="text-xl font-bold text-white">
                {userData?.email || 'Anonymous User'}
              </Text>
              <Text className="mt-1 text-sm text-white opacity-90">
                {userData?.title} • Level {userData?.level}
              </Text>
            </View>

            {/* Stats Row */}
            <View className="mt-4 flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">{userData?.streak || 0}</Text>
                <Text className="mt-1 text-xs text-white opacity-85">Day Streak</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">{userData?.totalXP || 0}</Text>
                <Text className="mt-1 text-xs text-white opacity-85">Total XP</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">
                  {userData?.badges?.length || 0}
                </Text>
                <Text className="mt-1 text-xs text-white opacity-85">Badges</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Anonymous Account Warning */}
        {user?.isAnonymous && (
          <View className="mx-6 mb-6">
            <TouchableOpacity
              onPress={handleLinkAccount}
              activeOpacity={0.7}
              className="rounded-2xl border border-warning-300 bg-warning-50 p-4">
              <View className="flex-row items-center">
                <Text className="mr-3 text-3xl">⚠️</Text>
                <View className="flex-1">
                  <Text className="mb-1 text-sm font-bold text-warning-900">
                    Save Your Progress
                  </Text>
                  <Text className="text-xs text-warning-800">
                    Link your email to prevent losing your data
                  </Text>
                </View>
                <Text className="text-lg text-warning-600">›</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Settings Section */}
        <View className="mb-4 px-6">
          <Text className="mb-3 text-base font-bold text-slate-900">Settings</Text>

          {/* Daily Goal */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/(settings)/daily-goal')}
            className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <Text className="text-xl">🎯</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-sm font-bold text-slate-900">Daily Screen Time Goal</Text>
              <Text className="text-xs text-slate-600">
                {userData?.settings?.screenTimeGoal || 2} hours per day
              </Text>
            </View>
            <Text className="text-lg text-slate-400">›</Text>
          </TouchableOpacity>

          {/* Notifications */}
          <View className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-success-100">
              <Text className="text-xl">🔔</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-sm font-bold text-slate-900">Push Notifications</Text>
              <Text className="text-xs text-slate-600">Daily reminders and updates</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
              thumbColor={notifications ? '#fff' : '#f1f5f9'}
            />
          </View>

          {/* Daily Check-in */}
          <View className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-warning-100">
              <Text className="text-xl">✅</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-sm font-bold text-slate-900">
                Daily Check-in Reminders
              </Text>
              <Text className="text-xs text-slate-600">Remind me to log my progress</Text>
            </View>
            <Switch
              value={dailyCheckIn}
              onValueChange={handleToggleDailyCheckIn}
              trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
              thumbColor={dailyCheckIn ? '#fff' : '#f1f5f9'}
            />
          </View>

          {/* Account */}
          {!user?.isAnonymous && (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/(settings)/account')}
              className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
              <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Text className="text-xl">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 text-sm font-bold text-slate-900">Account Settings</Text>
                <Text className="text-xs text-slate-600">Email and password</Text>
              </View>
              <Text className="text-lg text-slate-400">›</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Premium Section */}
        <View className="mb-4 px-6">
          <TouchableOpacity onPress={() => router.push('/paywall')} activeOpacity={0.9}>
            <LinearGradient
              colors={['#fbbf24', '#f59e0b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, padding: 20 }}>
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="mb-1 text-base font-bold text-white">⭐ Upgrade to Premium</Text>
                  <Text className="text-xs text-white opacity-90">
                    Unlock custom timers, themes & more
                  </Text>
                </View>
                <Text className="text-2xl text-white">›</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* More Section */}
        <View className="mb-4 px-6">
          <Text className="mb-3 text-base font-bold text-slate-900">More</Text>

          <TouchableOpacity className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <Text className="flex-1 text-sm text-slate-900">Help & Support</Text>
            <Text className="text-lg text-slate-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <Text className="flex-1 text-sm text-slate-900">Privacy Policy</Text>
            <Text className="text-lg text-slate-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <Text className="flex-1 text-sm text-slate-900">Terms of Service</Text>
            <Text className="text-lg text-slate-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <Text className="flex-1 text-sm text-slate-900">Rate Lock In</Text>
            <Text className="text-lg text-slate-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <Text className="flex-1 text-sm text-slate-900">Share with Friends</Text>
            <Text className="text-lg text-slate-400">›</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mb-4 px-6">
          <Text className="mb-2 text-center text-xs text-slate-400">Lock In v1.0.0</Text>
          <Text className="mb-6 text-center text-xs text-slate-400">
            Made with ❤️ for focused minds
          </Text>
        </View>

        {/* Sign Out */}
        <View className="mb-24 px-6">
          <TouchableOpacity onPress={handleSignOut} className="rounded-2xl bg-slate-100 p-4">
            <Text className="text-center text-sm font-bold text-slate-900">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
