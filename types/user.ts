// types/user.ts
import { UserLevel, Badge, Quest, Streak, XPSource } from './rewards';

export type UserData = {
  // Auth & Identity
  uid: string;
  isAnonymous: boolean;
  email?: string;
  createdAt: any; // Firestore Timestamp
  linkedAt?: any; // Firestore Timestamp
  onboardingCompleted: boolean;

  // XP and Leveling (from rewards.ts)
  totalXP: number;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  titleEmoji: string;
  tier: 'beginner' | 'awakening' | 'rising' | 'master' | 'legend';

  // Streaks (using Streak type from rewards.ts)
  streak: number; // Main streak
  streaks?: Streak; // Detailed streak data

  // Collections
  shields: Shield[];
  badges: Badge[]; // Using Badge from rewards.ts
  quests?: Quest[]; // Using Quest from rewards.ts
  unlockedRewards: Reward[];

  // Settings
  settings: UserSettings;

  // Stats
  stats: UserStats;

  // History
  xpHistory: XPSource[]; // Using XPSource from rewards.ts
  levelHistory: LevelHistoryEntry[];

  // Reasons for using app
  reason?: string[];
};

export type UserSettings = {
  screenTimeGoal: number; // hours per day
  notifications: boolean;
  dailyCheckIn: boolean;
};

export type UserStats = {
  // Session stats
  totalSessions: number;
  totalMinutes: number;
  sessionsToday: number;
  longestSession: number;
  maxSessionsPerDay: number;

  // Screen time
  screenTimeToday: number;

  // XP
  xpToday: number;

  // Quests
  totalResists: number;
  questsCompleted: number;
  dailyQuestStreak: number;
  maxQuestsPerDay: number;

  // Phone-free activities
  phoneFreeMeals: number;
  phoneFreeSocial: number;
  phoneFreeOutdoor: number;

  // Other
  sleepStreak: number;
  perfectDays: number;
  comebackStreaks: number;
  lateNightFreeStreak: number;
  appsDeleted: number;
  communityHelps: number;

  // Longest streak
  longestStreak?: number;
};

export type Shield = {
  id: string;
  name: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  emoji: string;
  usedDate?: any; // Firestore Timestamp
  expiresAt?: any; // Firestore Timestamp
};

export type Reward = {
  id: string;
  type: 'title' | 'emoji' | 'theme' | 'feature';
  name: string;
  description: string;
  unlockedAt: any; // Firestore Timestamp
};

export type LevelHistoryEntry = {
  level: number;
  reachedAt: any; // Firestore Timestamp
};

// Helper type for components that need user data with level calculations
export type UserWithLevel = UserData & UserLevel;
