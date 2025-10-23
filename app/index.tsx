// app/index.tsx
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, [user, authLoading]);

  const checkUserStatus = async () => {
    // Wait for auth to finish loading
    if (authLoading) return;

    try {
      // No user - go to onboarding
      if (!user) {
        router.replace('/welcome');
        return;
      }

      // User exists - check if onboarding is completed
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if user has completed onboarding
        // You can use different criteria:
        // - onboardingCompleted flag
        // - screenTimeGoal is set
        // - has any sessions
        const hasCompletedOnboarding =
          userData.onboardingCompleted === true || userData.settings?.screenTimeGoal !== undefined;

        if (hasCompletedOnboarding) {
          // Onboarding done - go to app
          router.replace('/(tabs)/(home)/home');
        } else {
          // Onboarding not done - continue onboarding
          router.replace('/set-goal');
        }
      } else {
        // User document doesn't exist yet - start onboarding
        router.replace('/set-goal');
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // On error, default to welcome screen
      router.replace('/welcome');
    } finally {
      setChecking(false);
    }
  };

  // Show loading while checking
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
