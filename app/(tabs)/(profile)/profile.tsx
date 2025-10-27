// app/(tabs)/profile.tsx - No Context Version
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { AuthService } from '../../../services/authService';
import { getLevelFromXP } from '../../../utils/levelingSystem';
import * as Notifications from 'expo-notifications';
import { UserData } from '../../../types/user';

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  const [notifications, setNotifications] = useState(true);
  const [dailyCheckIn, setDailyCheckIn] = useState(true);

  // Listen to user data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setUserData(null);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const levelData = getLevelFromXP(data.totalXP || 0);

          // Combine Firestore data with calculated level data
          setUserData({
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            email: user.email || undefined,
            ...data,
            ...levelData,
          } as UserData);

          setNotifications(data.settings?.notifications ?? true);
          setDailyCheckIn(data.settings?.dailyCheckIn ?? true);
        }
        setLoading(false);
      },
      (error) => {
        // Handle errors (like permission denied after sign out)
        console.error('Firestore listener error:', error.code);
        if (error.code === 'permission-denied') {
          // User signed out, stop trying to access data
          setUserData(null);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleToggleNotifications = async (value: boolean) => {
    setNotifications(value);

    if (!user) return;

    try {
      console.log('Toggling notifications:', value);

      // Check notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        setNotifications(false);
        return;
      }

      await updateDoc(doc(db, 'users', user.uid), {
        'settings.notifications': value,
      });

      console.log('Notifications setting updated successfully');
    } catch (error) {
      console.error('Error in handleToggleNotifications:', error);
      setNotifications(!value);
    }
  };

  const handleToggleDailyCheckIn = async (value: boolean) => {
    setDailyCheckIn(value);

    if (!user) return;

    try {
      console.log('Toggling daily check-in:', value);

      // Check notification permissions (same flow)
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted for daily check-in');
        setDailyCheckIn(false);
        return;
      }

      await updateDoc(doc(db, 'users', user.uid), {
        'settings.dailyCheckIn': value,
      });

      console.log('Daily check-in setting updated successfully');
    } catch (error) {
      console.error('Error in handleToggleDailyCheckIn:', error);
      setDailyCheckIn(!value);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AuthService.signOut();
            // index.tsx will handle navigation
          } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
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
                          await AuthService.linkWithEmail(email, password);
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

  if (loading || !userData || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

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
                <Text className="text-5xl">{userData.titleEmoji || '🌱'}</Text>
              </View>
              <Text className="text-xl font-bold text-white">
                {userData.email || user.email || 'Anonymous User'}
              </Text>
              <Text className="mt-1 text-sm text-white opacity-90">
                {userData.title} • Level {userData.level}
              </Text>
            </View>

            {/* Stats Row */}
            <View className="mt-4 flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">{userData.streak || 0}</Text>
                <Text className="mt-1 text-xs text-white opacity-85">Day Streak</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">{userData.totalXP || 0}</Text>
                <Text className="mt-1 text-xs text-white opacity-85">Total XP</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white">
                  {userData.badges?.length || 0}
                </Text>
                <Text className="mt-1 text-xs text-white opacity-85">Badges</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Anonymous Account Warning */}
        {user.isAnonymous && (
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
            onPress={() => router.push('/(tabs)/(profile)/daily-goal')}
            className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <Text className="text-xl">🎯</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-sm font-bold text-slate-900">Daily Screen Time Goal</Text>
              <Text className="text-xs text-slate-600">
                {userData.settings?.screenTimeGoal || 2} hours per day
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
              <Text className="text-xs text-slate-600">Announcements and updates</Text>
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
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/(profile)/account')}
            className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Text className="text-xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-sm font-bold text-slate-900">Account Settings</Text>
              <Text className="text-xs text-slate-600">Manage your Account</Text>
            </View>
            <Text className="text-lg text-slate-400">›</Text>
          </TouchableOpacity>
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
