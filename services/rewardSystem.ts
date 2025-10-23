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
} from 'firebase/firestore';
import { db } from '../firebase';
import { getLevelFromXP, getLevelRewards } from '../utils/levelingSystem';
import { checkShieldEarned, Shield } from '../utils/streakShieldSystem';
import { Badge, Quest } from '../types/rewards';
import { BADGES } from '../data/badge';

export class RewardService {
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

    // Update user XP
    await updateDoc(userRef, {
      totalXP: increment(amount),
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
    const streak = userData.streak?.main || 0;
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
        return (userData.streak?.main || 0) >= requirement.value;

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
        return (userData.streak?.evening || 0) >= requirement.value;

      case 'morning_streak':
        return (userData.streak?.morning || 0) >= requirement.value;

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
        const morning = userData.streak?.morning || 0;
        const evening = userData.streak?.evening || 0;
        const meal = userData.streak?.meal || 0;
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
      'stats.questsCompletedToday': increment(1),
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
    streakType: 'main' | 'morning' | 'evening' | 'meal',
    increment: boolean
  ): Promise<{ newStreak: number; shieldEarned?: Shield; xpBonus?: number }> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const currentStreak = userData.streak?.[streakType] || 0;
    const newStreak = increment ? currentStreak + 1 : 0;

    await updateDoc(userRef, {
      [`streak.${streakType}`]: newStreak,
      [`streak.${streakType}LastUpdate`]: Timestamp.now(),
    });

    const result: any = { newStreak };

    // Award streak milestone bonus for main streak
    if (streakType === 'main' && increment) {
      const bonusXP = this.calculateStreakBonus(newStreak);
      if (bonusXP > 0) {
        await this.awardXP(userId, bonusXP, 'streak_milestone', { streak: newStreak });
        result.xpBonus = bonusXP;
      }

      // Check for shield earned
      const shields = userData.shields || [];
      const shieldEarned = checkShieldEarned(newStreak, shields);
      if (shieldEarned) {
        result.shieldEarned = shieldEarned;
        await updateDoc(userRef, {
          shields: arrayUnion(shieldEarned),
        });
      }
    }

    // Check for badges
    await this.checkBadgeProgress(userId);

    return result;
  }

  private static calculateStreakBonus(days: number): number {
    const milestones = [3, 7, 14, 30, 50, 100, 200, 365];
    if (milestones.includes(days)) {
      return days >= 100 ? 1000 : days >= 30 ? 500 : days >= 14 ? 250 : days >= 7 ? 100 : 50;
    }
    return 0;
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
    const streak = userData.streak?.main || 0;

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

  private static getStreakMultiplier(days: number): number {
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
