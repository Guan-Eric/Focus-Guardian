// utils/xpSystem.ts
export const XP_REWARDS = {
  // Daily Actions
  DAILY_CHECKIN: 20,
  OPEN_APP: 5,

  // Focus Sessions (per minute)
  FOCUS_SESSION_BASE: 2, // 2 XP per minute

  // Screen Time
  UNDER_GOAL: 50,
  BEAT_YESTERDAY: 30,
  ZERO_SOCIAL_DAY: 100,

  // Resistance
  RESIST_APP: 5,
  RESIST_5_TIMES: 25,
  RESIST_10_TIMES: 50,

  // Quests
  QUEST_EASY: 25,
  QUEST_MEDIUM: 75,
  QUEST_HARD: 150,
  QUEST_EPIC: 500,

  // Social
  HELP_COMMUNITY: 15,
  POST_UPDATE: 10,
  RECEIVE_UPVOTE: 2,

  // Streaks (bonus multipliers)
  STREAK_3_DAYS: 1.1, // 10% bonus
  STREAK_7_DAYS: 1.2, // 20% bonus
  STREAK_14_DAYS: 1.3, // 30% bonus
  STREAK_30_DAYS: 1.5, // 50% bonus
  STREAK_100_DAYS: 2.0, // 100% bonus
};

export const calculateSessionXP = (durationMinutes: number, streakDays: number): number => {
  const baseXP = durationMinutes * XP_REWARDS.FOCUS_SESSION_BASE;
  const streakMultiplier = getStreakMultiplier(streakDays);
  return Math.floor(baseXP * streakMultiplier);
};

export const getStreakMultiplier = (days: number): number => {
  if (days >= 100) return XP_REWARDS.STREAK_100_DAYS;
  if (days >= 30) return XP_REWARDS.STREAK_30_DAYS;
  if (days >= 14) return XP_REWARDS.STREAK_14_DAYS;
  if (days >= 7) return XP_REWARDS.STREAK_7_DAYS;
  if (days >= 3) return XP_REWARDS.STREAK_3_DAYS;
  return 1.0;
};

export const calculateStreakBonus = (days: number): number => {
  if (days >= 100) return 100;
  if (days >= 30) return 50;
  if (days >= 14) return 25;
  if (days >= 7) return 10;
  if (days >= 3) return 5;
  return 0;
};
