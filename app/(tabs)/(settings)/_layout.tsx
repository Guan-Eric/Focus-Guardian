import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack initialRouteName="settings">
      <Stack.Screen
        name="settings"
        options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
