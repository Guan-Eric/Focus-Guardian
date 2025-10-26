// app/index.tsx
import { View, ActivityIndicator, InteractionManager } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Index() {
  const [loading, setLoading] = useState(true);
  // Single auth listener for routing only
  const unsubscribe = async () => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          // No user - navigate after interactions complete
          InteractionManager.runAfterInteractions(() => {
            router.replace('/welcome');
            setLoading(false);
          });
          return;
        }

        // User exists - check onboarding status
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          InteractionManager.runAfterInteractions(() => {
            if (userData.onboardingCompleted) {
              router.replace('/(tabs)/(home)/home');
            } else {
              router.replace('/set-goal');
            }
            setLoading(false);
          });
        } else {
          // No document - go to onboarding
          InteractionManager.runAfterInteractions(() => {
            router.replace('/set-goal');
            setLoading(false);
          });
        }
      } catch (error) {
        console.error('Error in auth check:', error);
        InteractionManager.runAfterInteractions(() => {
          router.replace('/welcome');
          setLoading(false);
        });
      }
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      await unsubscribe();
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return null;
}

export default Index;
