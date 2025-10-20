import { Stack } from 'expo-router';

export default function StatsLayout() {
  return (
    <Stack initialRouteName="stats">
      <Stack.Screen
        name="stats"
        options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
