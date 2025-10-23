import { UserLevel } from '../types/rewards';

// utils/levelingSystem.ts
export const LEVEL_SYSTEM = {
  // XP required per level tier
  TIER_1: { min: 1, max: 10, xpPerLevel: 100 }, // 1,000 XP total
  TIER_2: { min: 11, max: 25, xpPerLevel: 250 }, // 3,750 XP total
  TIER_3: { min: 26, max: 50, xpPerLevel: 500 }, // 12,500 XP total
  TIER_4: { min: 51, max: 75, xpPerLevel: 1000 }, // 25,000 XP total
  TIER_5: { min: 76, max: 100, xpPerLevel: 2500 }, // 62,500 XP total
  // Total to Level 100: 104,750 XP
};

export const LEVEL_TITLES = [
  // Levels 1-5: Wanderer
  { min: 1, max: 5, title: 'Wanderer', emoji: '🌱', tier: 'beginner' },

  // Levels 6-10: Apprentice
  { min: 6, max: 10, title: 'Apprentice', emoji: '📚', tier: 'beginner' },

  // Levels 11-15: Guardian
  { min: 11, max: 15, title: 'Guardian', emoji: '🛡️', tier: 'awakening' },

  // Levels 16-20: Focus Knight
  { min: 16, max: 20, title: 'Focus Knight', emoji: '⚔️', tier: 'awakening' },

  // Levels 21-25: Discipline Warrior
  { min: 21, max: 25, title: 'Discipline Warrior', emoji: '🏹', tier: 'awakening' },

  // Levels 26-30: Mindful Sage
  { min: 26, max: 30, title: 'Mindful Sage', emoji: '🧘', tier: 'rising' },

  // Levels 31-40: Zen Master
  { min: 31, max: 40, title: 'Zen Master', emoji: '☯️', tier: 'rising' },

  // Levels 41-50: Concentration Lord
  { min: 41, max: 50, title: 'Concentration Lord', emoji: '🧙', tier: 'rising' },

  // Levels 51-75: Discipline Grandmaster
  { min: 51, max: 75, title: 'Discipline Grandmaster', emoji: '👑', tier: 'master' },

  // Levels 76-100: Legend of Focus
  { min: 76, max: 100, title: 'Legend of Focus', emoji: '✨', tier: 'legend' },
];

export const calculateXPForLevel = (level: number): number => {
  if (level <= 10) return level * 100;
  if (level <= 25) return 1000 + (level - 10) * 250;
  if (level <= 50) return 4750 + (level - 25) * 500;
  if (level <= 75) return 17250 + (level - 50) * 1000;
  if (level <= 100) return 42250 + (level - 75) * 2500;
  return 104750;
};

export const getLevelFromXP = (totalXP: number): UserLevel => {
  let level = 1;
  let xpSoFar = 0;

  while (xpSoFar + getXPForNextLevel(level) <= totalXP && level < 100) {
    xpSoFar += getXPForNextLevel(level);
    level++;
  }

  const currentXP = totalXP - xpSoFar;
  const xpToNextLevel = getXPForNextLevel(level);
  const titleData = LEVEL_TITLES.find((t) => level >= t.min && level <= t.max)!;

  return {
    level,
    currentXP,
    totalXP,
    xpToNextLevel,
    title: titleData.title,
    titleEmoji: titleData.emoji,
    tier: titleData.tier as any,
  };
};

export const getXPForNextLevel = (currentLevel: number): number => {
  if (currentLevel <= 10) return 100;
  if (currentLevel <= 25) return 250;
  if (currentLevel <= 50) return 500;
  if (currentLevel <= 75) return 1000;
  if (currentLevel <= 100) return 2500;
  return 2500;
};

export const getLevelRewards = (level: number): string[] => {
  const rewards: string[] = [];

  // Every 5 levels
  if (level % 5 === 0) {
    rewards.push('New avatar customization');
    rewards.push('Special badge');
  }

  // Every 10 levels
  if (level % 10 === 0) {
    rewards.push('New theme unlocked');
    rewards.push('Premium feature (free tier)');
  }

  // Special milestones
  if (level === 25) rewards.push('Custom challenge creator');
  if (level === 50) rewards.push('All themes unlocked');
  if (level === 75) rewards.push('Legendary avatar');
  if (level === 100) rewards.push('Ultimate Legend status');

  return rewards;
};
