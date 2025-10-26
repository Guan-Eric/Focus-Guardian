// services/rewardService.ts
import {
  collection,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  getDoc,
  setDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getLevelFromXP, getLevelRewards } from '../utils/levelingSystem';
import { checkShieldEarned, Shield } from '../utils/streakShieldSystem';
import { Badge, DailyQuest, Quest } from '../types/rewards';
import { BADGES } from '../data/badge';

export class RewardService {
  // Generate daily quests based on user data
  static async generateDailyQuests(userId: string): Promise<DailyQuest[]> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of day

    // Get today's stats
    const sessionsToday = userData.stats?.sessionsToday || 0;
    const xpToday = userData.stats?.xpToday || 0;
    const screenTimeToday = userData.stats?.screenTimeToday || 0;
    const screenTimeGoal = userData.settings?.screenTimeGoal || 2;
    const currentStreak = userData.streak || 0;

    // Check if user has completed at least 30 minutes of sessions today
    const totalMinutesToday = await this.getTodaySessionMinutes(userId);
    const hasCompletedSession = totalMinutesToday >= 30;

    const quests: DailyQuest[] = [];

    // Quest 1: Complete focus sessions (at least 30 minutes combined)
    quests.push({
      id: 'session-30min',
      title: 'Complete 30 minutes of focus sessions',
      description: 'Stay focused for a total of 30 minutes today',
      type: 'daily',
      difficulty: 'easy',
      xpReward: 20,
      requirement: {
        type: 'session',
        target: 30,
        current: totalMinutesToday,
      },
      completed: hasCompletedSession,
      progress: Math.min((totalMinutesToday / 30) * 100, 100),
      expiresAt: today,
    });

    // // Quest 2: Stay under screen time goal
    // const screenTimePercent = (screenTimeToday / (screenTimeGoal * 60)) * 100;
    // const stayedUnderGoal = screenTimeToday <= screenTimeGoal * 60;
    // quests.push({
    //   id: 'screentime-goal',
    //   title: 'Stay under screen time goal',
    //   description: `Keep your screen time under ${screenTimeGoal} hours today`,
    //   type: 'daily',
    //   difficulty: 'medium',
    //   xpReward: 50,
    //   requirement: {
    //     type: 'screenTime',
    //     target: screenTimeGoal * 60,
    //     current: screenTimeToday,
    //   },
    //   completed: stayedUnderGoal && screenTimeToday > 0,
    //   progress: Math.min(screenTimePercent, 100),
    //   expiresAt: today,
    // });

    // Quest 3: Complete 3 sessions in a day
    const completedThreeSessions = sessionsToday >= 3;
    quests.push({
      id: 'three-sessions',
      title: 'Complete 3 focus sessions',
      description: 'Complete at least 3 separate focus sessions today',
      type: 'daily',
      difficulty: 'medium',
      xpReward: 35,
      requirement: {
        type: 'sessions_count',
        target: 3,
        current: sessionsToday,
      },
      completed: completedThreeSessions,
      progress: Math.min((sessionsToday / 3) * 100, 100),
      expiresAt: today,
    });

    // Quest 4: Earn 100 XP today
    const earned100XP = xpToday >= 100;
    quests.push({
      id: 'xp-goal',
      title: 'Earn 100 XP today',
      description: 'Accumulate 100 XP through various activities',
      type: 'daily',
      difficulty: 'hard',
      xpReward: 25,
      requirement: {
        type: 'xp',
        target: 100,
        current: xpToday,
      },
      completed: earned100XP,
      progress: Math.min((xpToday / 100) * 100, 100),
      expiresAt: today,
    });

    // Quest 5: Maintain your streak
    const maintainedStreak = currentStreak > 0 && sessionsToday > 0;
    quests.push({
      id: 'maintain-streak',
      title: `Maintain your ${currentStreak}-day streak`,
      description: 'Complete at least one session to keep your streak alive',
      type: 'daily',
      difficulty: 'easy',
      xpReward: 15,
      requirement: {
        type: 'streak',
        target: 1,
        current: sessionsToday,
      },
      completed: maintainedStreak,
      progress: sessionsToday > 0 ? 100 : 0,
      expiresAt: today,
    });

    return quests;
  }

  // Get total minutes of sessions completed today
  private static async getTodaySessionMinutes(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionsRef = collection(db, 'sessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(today))
    );

    const snapshot = await getDocs(q);
    let totalMinutes = 0;

    snapshot.forEach((doc) => {
      totalMinutes += doc.data().duration || 0;
    });

    return totalMinutes;
  }

  // Check and complete daily quest
  static async checkDailyQuestCompletion(
    userId: string,
    questId: string
  ): Promise<{
    completed: boolean;
    xpAwarded?: number;
    quest?: DailyQuest;
  }> {
    const quests = await this.generateDailyQuests(userId);
    const quest = quests.find((q) => q.id === questId);

    if (!quest) {
      return { completed: false };
    }

    if (!quest.completed) {
      return { completed: false };
    }

    // Check if quest was already completed today
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const completedToday = userData?.dailyQuestsCompleted || {};
    const todayKey = new Date().toISOString().split('T')[0];

    if (completedToday[todayKey]?.includes(questId)) {
      return { completed: true, xpAwarded: 0 };
    }

    // Mark quest as completed
    await updateDoc(userRef, {
      [`dailyQuestsCompleted.${todayKey}`]: arrayUnion(questId),
      'stats.questsCompleted': increment(1),
      'stats.dailyQuestStreak': increment(1),
    });

    // Award XP
    const result = await this.awardXP(userId, quest.xpReward, `daily_quest:${questId}`, {
      questId,
      questTitle: quest.title,
    });

    return {
      completed: true,
      xpAwarded: result.xpAwarded,
      quest,
    };
  }

  // Award XP and check for level ups
  static async awardXP(
    userId: string,
    amount: number,
    source: string,
    metadata?: any
  ): Promise<{
    xpAwarded: number;
    leveledUp: boolean;
    newLevel?: number;
    badgesEarned?: Badge[];
    shieldEarned?: Shield;
  }> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const oldTotalXP = userData.totalXP || 0;
    const oldLevel = getLevelFromXP(oldTotalXP).level;

    const newTotalXP = oldTotalXP + amount;
    const newLevelData = getLevelFromXP(newTotalXP);
    const leveledUp = newLevelData.level > oldLevel;

    // Update user XP and xpToday
    await updateDoc(userRef, {
      totalXP: increment(amount),
      'stats.xpToday': increment(amount),
      xpHistory: arrayUnion({
        amount,
        source,
        timestamp: Timestamp.now(),
        metadata,
      }),
    });

    // Log XP transaction
    await setDoc(doc(collection(db, 'xpTransactions')), {
      userId,
      amount,
      source,
      timestamp: Timestamp.now(),
      metadata,
    });

    const result: any = {
      xpAwarded: amount,
      leveledUp,
    };

    // Handle level up
    if (leveledUp) {
      result.newLevel = newLevelData.level;

      await updateDoc(userRef, {
        level: newLevelData.level,
        title: newLevelData.title,
        titleEmoji: newLevelData.titleEmoji,
        levelHistory: arrayUnion({
          level: newLevelData.level,
          achievedAt: Timestamp.now(),
        }),
      });

      // Award level up rewards
      const rewards = getLevelRewards(newLevelData.level);
      if (rewards.length > 0) {
        await this.unlockLevelRewards(userId, newLevelData.level, rewards);
      }

      // Check for badges earned due to level milestone
      const badgesEarned = await this.checkBadgeProgress(userId);
      if (badgesEarned.length > 0) {
        result.badgesEarned = badgesEarned;
      }
    }

    // Check for shield earned
    const streak = userData.streak || 0;
    const shields = userData.shields || [];
    const shieldEarned = checkShieldEarned(streak, shields);

    if (shieldEarned) {
      result.shieldEarned = shieldEarned;
      await updateDoc(userRef, {
        shields: arrayUnion(shieldEarned),
      });
    }

    return result;
  }

  // Check and award badges
  static async checkBadgeProgress(userId: string): Promise<Badge[]> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return [];

    const userData = userDoc.data();
    const earnedBadges: Badge[] = [];
    const currentBadgeIds = (userData.badges || []).map((b: any) => b.id);

    for (const badge of BADGES) {
      // Skip if already earned
      if (currentBadgeIds.includes(badge.id)) continue;

      // Check if requirements are met
      const meetsRequirement = await this.checkBadgeRequirement(badge, userData);

      if (meetsRequirement) {
        earnedBadges.push(badge);

        // Award badge
        await updateDoc(userRef, {
          badges: arrayUnion({
            ...badge,
            unlockedAt: Timestamp.now(),
          }),
        });

        // Award badge XP
        await this.awardXP(userId, badge.xpReward, `badge:${badge.id}`);

        // Log badge earned
        await setDoc(doc(collection(db, 'badgeEvents')), {
          userId,
          badgeId: badge.id,
          timestamp: Timestamp.now(),
        });
      }
    }

    return earnedBadges;
  }

  // Check if badge requirement is met
  private static async checkBadgeRequirement(badge: Badge, userData: any): Promise<boolean> {
    const { requirement } = badge;

    switch (requirement.type) {
      case 'streak':
        return (userData.streak || 0) >= requirement.value;

      case 'sessions_completed':
        return (userData.stats?.totalSessions || 0) >= requirement.value;

      case 'session_duration':
        return (userData.stats?.longestSession || 0) >= requirement.value;

      case 'sessions_per_day':
        return (userData.stats?.maxSessionsPerDay || 0) >= requirement.value;

      case 'resists':
        return (userData.stats?.totalResists || 0) >= requirement.value;

      case 'quests_completed':
        return (userData.stats?.questsCompleted || 0) >= requirement.value;

      case 'daily_quest_streak':
        return (userData.stats?.dailyQuestStreak || 0) >= requirement.value;

      case 'evening_streak':
        return (userData.streaks?.evening || 0) >= requirement.value;

      case 'morning_streak':
        return (userData.streaks?.morning || 0) >= requirement.value;

      case 'phone_free_meals':
        return (userData.stats?.phoneFreeMeals || 0) >= requirement.value;

      case 'phone_free_social':
        return (userData.stats?.phoneFreeSocial || 0) >= requirement.value;

      case 'phone_free_outdoor':
        return (userData.stats?.phoneFreeOutdoor || 0) >= requirement.value;

      case 'sleep_quality_streak':
        return (userData.stats?.sleepStreak || 0) >= requirement.value;

      case 'zero_screen_time':
        return userData.stats?.perfectDays >= requirement.value;

      case 'streak_recovery':
        return userData.stats?.comebackStreaks >= requirement.value;

      case 'quests_per_day':
        return (userData.stats?.maxQuestsPerDay || 0) >= requirement.value;

      case 'late_night_free':
        return (userData.stats?.lateNightFreeStreak || 0) >= requirement.value;

      case 'apps_deleted':
        return (userData.stats?.appsDeleted || 0) >= requirement.value;

      case 'community_help':
        return (userData.stats?.communityHelps || 0) >= requirement.value;

      case 'multi_streak':
        const morning = userData.streaks?.morning || 0;
        const evening = userData.streaks?.evening || 0;
        const meal = userData.streaks?.meal || 0;
        return Math.min(morning, evening, meal) >= requirement.value;

      default:
        return false;
    }
  }

  // Complete a quest
  static async completeQuest(
    userId: string,
    questId: string
  ): Promise<{ xpAwarded: number; questCompleted: Quest }> {
    const questRef = doc(db, 'users', userId, 'quests', questId);
    const questDoc = await getDoc(questRef);

    if (!questDoc.exists()) {
      throw new Error('Quest not found');
    }

    const quest = questDoc.data() as Quest;

    if (quest.completed) {
      throw new Error('Quest already completed');
    }

    // Mark quest as completed
    await updateDoc(questRef, {
      completed: true,
      completedAt: Timestamp.now(),
    });

    // Update user stats
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'stats.questsCompleted': increment(1),
    });

    // Award XP
    const result = await this.awardXP(userId, quest.xpReward, `quest:${quest.difficulty}`, {
      questId,
      questTitle: quest.title,
    });

    return {
      xpAwarded: result.xpAwarded,
      questCompleted: quest,
    };
  }

  // Update streak
  static async updateStreak(
    userId: string,
    shouldIncrement: boolean
  ): Promise<{ newStreak: number; shieldEarned?: Shield; xpBonus?: number }> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const currentStreak = userData.streak || 0;
    const newStreak = shouldIncrement ? currentStreak + 1 : 0;

    await updateDoc(userRef, {
      streak: newStreak,
      streakLastUpdate: Timestamp.now(),
    });

    const result: any = { newStreak };

    // Award streak milestone bonus for main streak

    // Check for badges
    await this.checkBadgeProgress(userId);

    return result;
  }

  // Record session completion
  static async recordSession(
    userId: string,
    durationMinutes: number,
    mood?: string
  ): Promise<{ xpAwarded: number; badgesEarned?: Badge[] }> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const streak = userData.streak || 0;

    // Calculate XP with streak multiplier
    const baseXP = durationMinutes * 2;
    const multiplier = this.getStreakMultiplier(streak);
    const totalXP = Math.floor(baseXP * multiplier);

    // Update stats
    await updateDoc(userRef, {
      'stats.totalSessions': increment(1),
      'stats.totalMinutes': increment(durationMinutes),
      'stats.sessionsToday': increment(1),
      'stats.longestSession': Math.max(userData.stats?.longestSession || 0, durationMinutes),
      'stats.maxSessionsPerDay': Math.max(
        userData.stats?.maxSessionsPerDay || 0,
        (userData.stats?.sessionsToday || 0) + 1
      ),
    });

    // Record session
    await setDoc(doc(collection(db, 'sessions')), {
      userId,
      duration: durationMinutes,
      mood,
      timestamp: Timestamp.now(),
      xpEarned: totalXP,
    });

    // Award XP
    const result = await this.awardXP(userId, totalXP, 'focus_session', {
      duration: durationMinutes,
      mood,
    });

    // Check for badges
    const badgesEarned = await this.checkBadgeProgress(userId);

    return {
      xpAwarded: totalXP,
      badgesEarned: badgesEarned.length > 0 ? badgesEarned : undefined,
    };
  }

  public static getStreakMultiplier(days: number): number {
    if (days >= 100) return 2.0;
    if (days >= 30) return 1.5;
    if (days >= 14) return 1.3;
    if (days >= 7) return 1.2;
    if (days >= 3) return 1.1;
    return 1.0;
  }

  // Unlock level rewards
  private static async unlockLevelRewards(
    userId: string,
    level: number,
    rewards: string[]
  ): Promise<void> {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      unlockedRewards: arrayUnion(
        ...rewards.map((r) => ({
          reward: r,
          level,
          unlockedAt: Timestamp.now(),
        }))
      ),
    });
  }
}
