// utils/streakShieldSystem.ts
export type Shield = {
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  count: number;
  earnedAt: number; // streak day when earned
};

export const SHIELD_CONFIG = {
  bronze: {
    earnedAt: 7,
    saves: 1,
    name: 'Bronze Shield',
    emoji: '🥉',
    color: '#cd7f32',
  },
  silver: {
    earnedAt: 30,
    saves: 2,
    name: 'Silver Shield',
    emoji: '🥈',
    color: '#c0c0c0',
  },
  gold: {
    earnedAt: 100,
    saves: 3,
    name: 'Gold Shield',
    emoji: '🥇',
    color: '#ffd700',
  },
  platinum: {
    earnedAt: 365,
    saves: 999, // Unlimited (one per month)
    name: 'Platinum Shield',
    emoji: '💎',
    color: '#e5e4e2',
  },
};

export const checkShieldEarned = (streakDays: number, currentShields: Shield[]): Shield | null => {
  if (streakDays === 7 && !currentShields.find((s) => s.type === 'bronze')) {
    return { type: 'bronze', count: 1, earnedAt: 7 };
  }
  if (streakDays === 30 && !currentShields.find((s) => s.type === 'silver')) {
    return { type: 'silver', count: 2, earnedAt: 30 };
  }
  if (streakDays === 100 && !currentShields.find((s) => s.type === 'gold')) {
    return { type: 'gold', count: 3, earnedAt: 100 };
  }
  if (streakDays === 365 && !currentShields.find((s) => s.type === 'platinum')) {
    return { type: 'platinum', count: 999, earnedAt: 365 };
  }
  return null;
};

export const useShield = (shields: Shield[]): { success: boolean; shieldUsed: Shield | null } => {
  // Use best available shield
  if (shields.find((s) => s.type === 'platinum' && s.count > 0)) {
    return {
      success: true,
      shieldUsed: { type: 'platinum', count: 1, earnedAt: 365 },
    };
  }
  if (shields.find((s) => s.type === 'gold' && s.count > 0)) {
    return {
      success: true,
      shieldUsed: { type: 'gold', count: 1, earnedAt: 100 },
    };
  }
  if (shields.find((s) => s.type === 'silver' && s.count > 0)) {
    return {
      success: true,
      shieldUsed: { type: 'silver', count: 1, earnedAt: 30 },
    };
  }
  if (shields.find((s) => s.type === 'bronze' && s.count > 0)) {
    return {
      success: true,
      shieldUsed: { type: 'bronze', count: 1, earnedAt: 7 },
    };
  }

  return { success: false, shieldUsed: null };
};

// Premium feature: Craft shields using XP
export const SHIELD_CRAFTING_COSTS = {
  bronze: 500,
  silver: 1500,
  gold: 5000,
  platinum: 10000, // Can only craft 1 per month even with premium
};

export const canCraftShield = (
  isPremium: boolean,
  userXP: number,
  shieldType: 'bronze' | 'silver' | 'gold' | 'platinum'
): boolean => {
  if (!isPremium) return false;
  return userXP >= SHIELD_CRAFTING_COSTS[shieldType];
};
