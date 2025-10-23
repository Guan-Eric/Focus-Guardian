import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack initialRouteName="settings">
      <Stack.Screen
        name="settings"
        options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="account"
        options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="daily-goal"
        options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
