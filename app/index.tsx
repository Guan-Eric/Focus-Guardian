import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, Redirect, router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('onboardingSeen');
      router.replace(seen ? '/(tabs)/(home)/home' : '/welcome');
    })();
  }, []);

  return null;
}
