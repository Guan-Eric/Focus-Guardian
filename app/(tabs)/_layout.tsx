import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="(stats)"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
          animation: 'shift',
        }}
      />
    </Tabs>
  );
}
