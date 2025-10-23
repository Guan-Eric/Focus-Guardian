// types/rewards.ts
export type UserLevel = {
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  title: string;
  titleEmoji: string;
  tier: 'beginner' | 'awakening' | 'rising' | 'master' | 'legend';
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'streak' | 'session' | 'resistance' | 'quest' | 'lifestyle' | 'rare';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: string;
    value: number;
    description: string;
  };
  xpReward: number;
  unlockedAt?: Date;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'epic';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  requirement: {
    type: 'session' | 'screenTime' | 'resist' | 'streak' | 'custom';
    target: number;
    current: number;
  };
  completed: boolean;
  expiresAt: Date;
};

export type Streak = {
  main: number; // Days clean
  morning: number; // No phone first hour
  evening: number; // No phone last 2 hours
  meal: number; // Phone-free meals
  shields: {
    bronze: number; // Earned at 7 days
    silver: number; // Earned at 30 days
    gold: number; // Earned at 100 days
    platinum: number; // Earned at 365 days
  };
};

export type XPSource = {
  action: string;
  amount: number;
  timestamp: Date;
  multiplier?: number;
};
