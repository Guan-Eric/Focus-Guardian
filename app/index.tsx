// app/index.tsx - Simplest and Most Reliable
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Index() {
  const [loading, setLoading] = useState(true);

  const unsubscribe = async () => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          // No user - go to welcome
          console.log('No user, redirecting to welcome');
          router.replace('/welcome');
          setLoading(false);
          return;
        }

        // User exists - check onboarding status
        console.log('User found:', user.uid);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Onboarding status:', userData.onboardingCompleted);

          if (userData.onboardingCompleted) {
            // Onboarding complete - go to home
            router.replace('/(tabs)/(home)/home');
          } else {
            // Onboarding not complete - go to set goal
            router.replace('/set-goal');
          }
        } else {
          // User document doesn't exist yet - go to onboarding
          console.log('No user document, going to onboarding');
          router.replace('/set-goal');
        }
      } catch (error) {
        console.error('Error in auth check:', error);
        // On error, default to welcome
        router.replace('/welcome');
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Return null after navigation completes
  return null;
}

export default Index;
