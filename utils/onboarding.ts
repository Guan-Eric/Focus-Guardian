// utils/onboarding.ts
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { router } from 'expo-router';

/**
 * Mark onboarding as complete and navigate to home
 */
export async function completeOnboarding(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      onboardingCompleted: true,
    });

    // Navigate to home
    router.replace('/(tabs)/(home)/home');
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
}

/**
 * Reset onboarding (for testing purposes)
 */
export async function resetOnboarding(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      onboardingCompleted: false,
    });

    console.log('Onboarding reset for user:', userId);
  } catch (error) {
    console.error('Error resetting onboarding:', error);
    throw error;
  }
}
