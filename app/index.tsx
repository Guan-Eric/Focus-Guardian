// app/index.tsx
import { View, ActivityIndicator, InteractionManager } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';

function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure RevenueCat once at startup
    Purchases.configure({ apiKey: Constants.expoConfig?.extra?.revenueCatIos });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

        if (!userDoc.exists()) {
          InteractionManager.runAfterInteractions(() => {
            router.replace('/set-goal');
            setLoading(false);
          });
          return;
        }

        const userData = userDoc.data();

        // If onboarding not complete → go to onboarding
        if (!userData.onboardingCompleted) {
          InteractionManager.runAfterInteractions(() => {
            router.replace('/set-goal');
            setLoading(false);
          });
          return;
        }

        // ✅ Check subscription via RevenueCat
        const customerInfo = await Purchases.getCustomerInfo();
        const hasPro = !!customerInfo.entitlements.active['Pro'];

        InteractionManager.runAfterInteractions(() => {
          if (hasPro) {
            router.replace('/(tabs)/(home)/home');
          } else {
            router.replace('/paywall');
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error in auth check:', error);
        InteractionManager.runAfterInteractions(() => {
          router.replace('/welcome');
          setLoading(false);
        });
      }
    });

    // Cleanup listener
    return () => unsubscribe();
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
