import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useAuth } from '../../../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { userData, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Safe fallback if userData is null
  if (!userData && !loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-600">Loading user data...</Text>
      </View>
    );
  }

  // Safe access with defaults
  const level = userData?.level || 1;
  const title = userData?.title || 'Wanderer';
  const titleEmoji = userData?.titleEmoji || '🌱';
  const currentStreak = userData?.streak || 0;
  const totalXP = userData?.totalXP || 0;
  const currentXP = userData?.currentXP || 0;
  const xpToNextLevel = userData?.xpToNextLevel || 100;
  const screenTimeGoal = userData?.settings?.screenTimeGoal || 3;

  // Calculate today's stats (these would come from your stats object in production)
  const screenTimeToday = userData?.stats?.screenTimeToday || 0;
  const xpToday = userData?.stats?.xpToday || 0;
  const sessionsToday = userData?.stats?.sessionsToday || 0;
  const badgesEarned = userData?.badges?.length || 0;

  const screenTimeProgress = (screenTimeToday / screenTimeGoal) * 100;
  const xpProgress = (currentXP / xpToNextLevel) * 100;

  const [dailyQuests, setDailyQuests] = useState([
    {
      id: '1',
      title: 'Complete 30-min focus session',
      xp: 20,
      completed: true,
    },
    {
      id: '2',
      title: 'Stay under screen time goal',
      xp: 50,
      completed: false,
      progress: 60, // percentage
    },
    {
      id: '3',
      title: 'Resist distracting apps 5 times',
      xp: 15,
      completed: false,
      progress: 40,
    },
  ]);

  // Animations
  const pulseScale = useSharedValue(1);
  const fabScale = useSharedValue(1);

  useEffect(() => {
    // Pulse animation for streak fire emoji
    pulseScale.value = withRepeat(
      withSequence(
        withSpring(1.2, { damping: 2, stiffness: 100 }),
        withSpring(1, { damping: 2, stiffness: 100 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch latest data from Firebase
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleStartSession = () => {
    fabScale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    router.push('/(tabs)/(home)/focus-session');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4 pt-16">
          <View>
            <Text className="text-2xl font-bold text-slate-900">Welcome back! 👋</Text>
          </View>
        </View>

        {/* Streak Card */}
        <View className="mx-6 mb-5">
          <LinearGradient
            colors={['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 24 }}>
            <View className="relative py-6">
              {/* Background decoration */}
              <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white opacity-10" />
              <View className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white opacity-10" />

              {/* Level Badge */}
              <View className="absolute left-4 top-4 rounded-full bg-white/25 px-4 py-1.5">
                <Text className="text-xs font-bold text-white">
                  Level {level} {titleEmoji}
                </Text>
              </View>
              {/* Streak Content */}
              <View className="mt-8 items-center">
                <Text className="mb-1 text-7xl font-bold text-white">{currentStreak}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg text-white opacity-95">Day Streak</Text>
                  <Animated.Text style={pulseStyle} className="text-2xl">
                    🔥
                  </Animated.Text>
                </View>
                <Text className="mt-2 text-sm text-white opacity-85">
                  Keep going! Next milestone: 14 days
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Today's Progress Section */}
        <View className="mx-6 mb-4">
          <Text className="mb-3 text-base font-bold text-slate-900">Today's Progress</Text>

          <View className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5">
            {/* Screen Time Progress */}
            <View className="mb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-bold text-slate-700">Screen Time</Text>
                <Text className="text-sm font-bold text-success-600">
                  {screenTimeToday.toFixed(1)}h / {screenTimeGoal}h
                </Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-slate-200">
                <View
                  className="h-2 rounded-full bg-success-500"
                  style={{ width: `${Math.min(screenTimeProgress, 100)}%` }}
                />
              </View>
            </View>

            {/* XP Progress */}
            <View className="border-t border-slate-200 pt-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-bold text-slate-700">XP Today</Text>
                <Text className="text-sm font-bold text-primary-600">+{xpToday} XP</Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-slate-200">
                <View
                  className="h-2 rounded-full bg-primary-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Daily Quests Section */}
        <View className="mx-6 mb-4">
          <Text className="mb-3 text-base font-bold text-slate-900">Daily Quests</Text>

          {dailyQuests.map((quest, index) => (
            <View
              key={quest.id}
              className={`flex-row items-center rounded-xl p-4 ${
                quest.completed
                  ? 'mb-3 border-2 border-primary-200 bg-primary-50'
                  : 'mb-3 border-2 border-slate-200 bg-slate-50'
              }`}>
              {/* Checkbox */}
              <View
                className={`mr-3 h-6 w-6 items-center justify-center rounded-full ${
                  quest.completed
                    ? 'border-2 border-success-600 bg-success-500'
                    : 'border-2 border-slate-300 bg-white'
                }`}>
                {quest.completed && <Text className="text-xs font-bold text-white">✓</Text>}
              </View>

              {/* Quest Info */}
              <View className="flex-1">
                <Text
                  className={`mb-1 text-sm ${
                    quest.completed ? 'text-primary-900 line-through' : 'text-slate-900'
                  }`}>
                  {quest.title}
                </Text>

                {/* Progress bar for incomplete quests */}
                {!quest.completed && quest.progress !== undefined && (
                  <View className="mt-1 h-1 overflow-hidden rounded-full bg-slate-200">
                    <View
                      className="h-1 rounded-full bg-primary-400"
                      style={{ width: `${quest.progress}%` }}
                    />
                  </View>
                )}
              </View>

              {/* XP Badge */}
              <View className={`ml-3 ${quest.completed ? 'opacity-60' : ''}`}>
                <Text
                  className={`text-xs font-bold ${
                    quest.completed ? 'text-success-600' : 'text-slate-600'
                  }`}>
                  {quest.completed ? '✓ ' : ''}+{quest.xp} XP
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Stats */}
        <View className="mx-6 mb-4">
          <View className="rounded-2xl border border-warning-200 bg-warning-50 p-4">
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="mb-1 text-xs text-warning-900">
                  🎯 {sessionsToday} sessions today
                </Text>
                <Text className="text-xs text-warning-900">🏆 {badgesEarned} badges earned</Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="mb-1 text-xs text-warning-900">⚡ {totalXP} total XP</Text>
                <Text className="text-xs text-warning-900">📈 Level {level}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Motivational Card */}
        <View className="mx-6 mb-4">
          <View className="rounded-2xl border border-primary-200 bg-primary-50 p-4">
            <Text className="mb-1 text-xs font-bold text-primary-900">💡 Tip of the Day</Text>
            <Text className="text-xs leading-5 text-primary-800">
              The first 30 minutes after waking up are crucial. Keep your phone away and start your
              day with intention.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          fabStyle,
          {
            position: 'absolute',
            bottom: 30,
            right: 24,
            width: 70,
            height: 70,
            borderRadius: 35,
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}>
        <TouchableOpacity
          onPress={handleStartSession}
          activeOpacity={0.9}
          style={{ width: '100%', height: '100%' }}>
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 35,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text className="text-3xl text-white">▶</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Navigation would go here if using tabs */}
    </View>
  );
}
