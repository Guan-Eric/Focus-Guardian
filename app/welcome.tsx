// app/onboarding/welcome.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import ToggleSwitch from '../components/ToggleSwitch';
import { AuthService } from '../services/authService';

export default function WelcomeScreen() {
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);

  const handleGetStarted = async () => {
    setSigningIn(true);
    try {
      await AuthService.signInAnonymous();
    } catch (error) {
      Alert.alert('Error', 'Failed to start. Please try again.');
      setSigningIn(false);
    }
  };

  // Animation values
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const benefitsOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);

  useEffect(() => {
    // Sequence animations
    logoScale.value = withSpring(1);

    titleOpacity.value = withDelay(300, withSpring(1));
    benefitsOpacity.value = withDelay(600, withSpring(1));
    buttonScale.value = withDelay(900, withSpring(1));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const benefitsStyle = useAnimatedStyle(() => ({
    opacity: benefitsOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 items-center justify-center px-8">
        {/* Title */}
        <Animated.View style={titleStyle} className="mb-12 items-center">
          <Text className="mb-3 text-5xl font-bold text-slate-900">Lock In</Text>
          <Text className="text-center text-base text-slate-600">
            Take back control of your focus
          </Text>
        </Animated.View>

        {/* Value Props */}
        <Animated.View style={benefitsStyle} className="mb-12 w-full">
          <View className="mb-5 flex-row items-center">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <Text className="text-xl">⚡</Text>
            </View>
            <Text className="flex-1 text-base text-slate-700">Build unbreakable focus habits</Text>
          </View>

          <View className="mb-5 flex-row items-center">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-success-100">
              <Text className="text-xl">🎯</Text>
            </View>
            <Text className="flex-1 text-base text-slate-700">
              Track progress with gamification
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-warning-100">
              <Text className="text-xl">🏆</Text>
            </View>
            <Text className="flex-1 text-base text-slate-700">Level up your discipline daily</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom CTA */}
      <Animated.View style={buttonStyle} className="px-8 pb-12">
        {/* Animated Logo */}
        <Animated.View style={logoStyle} className="mb-8">
          <View className="items-center justify-center">
            {/* Slider Logo */}
            <ToggleSwitch title="Get Started" onToggle={() => handleGetStarted()} />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
