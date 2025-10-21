import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="how-it-works" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="set-goal" />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
