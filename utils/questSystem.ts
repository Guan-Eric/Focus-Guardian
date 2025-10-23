import { Quest } from '../types/rewards';

// utils/questSystem.ts
export const DAILY_QUESTS = {
  EASY: [
    {
      title: 'Morning Start',
      description: 'Complete a 15-minute focus session',
      type: 'session' as const,
      target: 15,
      xp: 25,
    },
    {
      title: 'Resist Temptation',
      description: 'Resist opening distracting apps 3 times',
      type: 'resist' as const,
      target: 3,
      xp: 20,
    },
    {
      title: 'Daily Check-in',
      description: 'Open the app and log your mood',
      type: 'checkin' as const,
      target: 1,
      xp: 15,
    },
    {
      title: 'Phone-Free Meal',
      description: 'Have one meal without your phone',
      type: 'lifestyle' as const,
      target: 1,
      xp: 20,
    },
    {
      title: 'Morning Routine',
      description: 'No phone for first hour after waking',
      type: 'morning' as const,
      target: 1,
      xp: 30,
    },
  ],

  MEDIUM: [
    {
      title: 'Deep Focus',
      description: 'Complete a 30-minute focus session',
      type: 'session' as const,
      target: 30,
      xp: 50,
    },
    {
      title: 'Screen Time Victory',
      description: 'Stay under your screen time goal',
      type: 'screenTime' as const,
      target: 1,
      xp: 75,
    },
    {
      title: 'Resistance Master',
      description: 'Resist distracting apps 5 times',
      type: 'resist' as const,
      target: 5,
      xp: 40,
    },
    {
      title: 'Evening Peace',
      description: 'No phone 2 hours before bed',
      type: 'evening' as const,
      target: 1,
      xp: 45,
    },
    {
      title: 'Double Session',
      description: 'Complete 2 focus sessions',
      type: 'sessions' as const,
      target: 2,
      xp: 60,
    },
  ],

  HARD: [
    {
      title: 'Extended Focus',
      description: 'Complete a 60-minute focus session',
      type: 'session' as const,
      target: 60,
      xp: 100,
    },
    {
      title: 'Social Media Sabbatical',
      description: 'Zero social media all day',
      type: 'noSocial' as const,
      target: 1,
      xp: 150,
    },
    {
      title: 'Iron Will',
      description: 'Resist distracting apps 10 times',
      type: 'resist' as const,
      target: 10,
      xp: 120,
    },
    {
      title: 'Triple Session',
      description: 'Complete 3 focus sessions',
      type: 'sessions' as const,
      target: 3,
      xp: 130,
    },
    {
      title: 'Phone-Free Morning',
      description: 'No phone until 12 PM',
      type: 'phoneFreeMorning' as const,
      target: 1,
      xp: 140,
    },
  ],
};

export const WEEKLY_CHALLENGES = [
  {
    title: 'Weekly Warrior',
    description: 'Average under 3 hours screen time',
    type: 'screenTime' as const,
    target: 3,
    duration: 7,
    xp: 300,
  },
  {
    title: 'Social Media Detox',
    description: 'Zero social media for 7 days',
    type: 'noSocial' as const,
    target: 7,
    duration: 7,
    xp: 500,
  },
  {
    title: 'Meal Master',
    description: '5 phone-free meals this week',
    type: 'meals' as const,
    target: 5,
    duration: 7,
    xp: 250,
  },
  {
    title: 'Social Butterfly',
    description: '3 phone-free social outings',
    type: 'social' as const,
    target: 3,
    duration: 7,
    xp: 300,
  },
  {
    title: 'Consistency King',
    description: 'Complete daily quests every day for 7 days',
    type: 'dailyQuestStreak' as const,
    target: 7,
    duration: 7,
    xp: 400,
  },
  {
    title: 'Focus Marathon',
    description: 'Complete 10 focus sessions this week',
    type: 'sessions' as const,
    target: 10,
    duration: 7,
    xp: 350,
  },
  {
    title: 'Morning Mastery',
    description: 'Phone-free mornings for 5 days',
    type: 'mornings' as const,
    target: 5,
    duration: 7,
    xp: 280,
  },
];

export const EPIC_CHALLENGES = [
  {
    title: 'Digital Detox Weekend',
    description: '48 hours completely phone-free',
    type: 'detox' as const,
    target: 48,
    duration: 2,
    xp: 1000,
  },
  {
    title: 'Social Media Sabbatical',
    description: '30 days without social media',
    type: 'noSocial' as const,
    target: 30,
    duration: 30,
    xp: 2500,
  },
  {
    title: 'The Minimalist',
    description: 'Remove 10 apps and keep them deleted for 14 days',
    type: 'appsDeleted' as const,
    target: 10,
    duration: 14,
    xp: 1500,
  },
  {
    title: 'Century Sprint',
    description: 'Complete 100 focus sessions in 30 days',
    type: 'sessions' as const,
    target: 100,
    duration: 30,
    xp: 3000,
  },
  {
    title: 'Triple Threat',
    description: 'Maintain morning, evening, and meal streaks for 30 days',
    type: 'multiStreak' as const,
    target: 30,
    duration: 30,
    xp: 2000,
  },
];

export const generateDailyQuests = (userLevel: number, history: any[]): Quest[] => {
  const quests: Quest[] = [];

  // Select 1 easy, 1 medium, 1 hard quest
  const easy = DAILY_QUESTS.EASY[Math.floor(Math.random() * DAILY_QUESTS.EASY.length)];
  const medium = DAILY_QUESTS.MEDIUM[Math.floor(Math.random() * DAILY_QUESTS.MEDIUM.length)];
  const hard = DAILY_QUESTS.HARD[Math.floor(Math.random() * DAILY_QUESTS.HARD.length)];

  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  quests.push(
    {
      id: `daily-easy-${now.toISOString()}`,
      title: easy.title,
      description: easy.description,
      type: 'daily',
      difficulty: 'easy',
      xpReward: easy.xp,
      requirement: {
        type: easy.type as 'screenTime' | 'streak' | 'session' | 'resist' | 'custom',
        target: easy.target,
        current: 0,
      },
      completed: false,
      expiresAt: endOfDay,
    },
    {
      id: `daily-medium-${now.toISOString()}`,
      title: medium.title,
      description: medium.description,
      type: 'daily',
      difficulty: 'medium',
      xpReward: medium.xp,
      requirement: {
        type: medium.type as 'session' | 'resist' | 'screenTime' | 'streak' | 'custom',
        target: medium.target,
        current: 0,
      },
      completed: false,
      expiresAt: endOfDay,
    },
    {
      id: `daily-hard-${now.toISOString()}`,
      title: hard.title,
      description: hard.description,
      type: 'daily',
      difficulty: 'hard',
      xpReward: hard.xp,
      requirement: {
        type: hard.type as 'session' | 'resist' | 'screenTime' | 'streak' | 'custom',
        target: hard.target,
        current: 0,
      },
      completed: false,
      expiresAt: endOfDay,
    }
  );

  return quests;
};
