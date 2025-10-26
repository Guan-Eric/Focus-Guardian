import { View, Text, Pressable, Modal, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ToggleSwitch from '../../../components/ToggleSwitch';
import ExitButton from '../../../components/ExitButton';

export default function FocusSession() {
  const durations = [15, 25, 50];
  const [index, setIndex] = useState(1);
  const [duration, setDuration] = useState(25);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDuration, setCustomDuration] = useState('');

  const handleDurationChange = (selectedIndex: number, duration: number) => {
    setIndex(selectedIndex);
    setDuration(duration);
  };

  const handleCustomPress = () => {
    setShowCustomModal(true);
  };

  const handleCustomSubmit = () => {
    const minutes = parseInt(customDuration);

    if (isNaN(minutes) || minutes < 0 || minutes > 180) {
      Alert.alert('Invalid Duration', 'Please enter a duration between 5 and 180 minutes');
      return;
    }

    setIndex(3);
    setDuration(minutes);
    setCustomDuration('');
    setShowCustomModal(false);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1 items-center bg-slate-50 px-6">
        {/* Header */}
        <View className="w-full flex-row justify-between">
          <Text className="text-3xl font-bold text-slate-800">Focus Session</Text>
          <ExitButton onPress={() => router.back()} />
        </View>

        {/* Timer Selector */}
        <View className="mb-8 mt-10 items-center">
          <Text className="text-base text-slate-500">Choose your focus time</Text>

          <View className="mt-4 flex-row justify-center">
            {durations.map((min, idx) => (
              <Pressable
                key={min}
                onPress={() => handleDurationChange(idx, min)}
                className={`mx-3 rounded-2xl border-4 px-5 py-5 ${
                  index === idx
                    ? 'border-primary-600 bg-primary-100'
                    : 'border-slate-300 bg-slate-100'
                }`}>
                <Text
                  className={`text-center text-3xl font-bold ${index === idx ? 'text-primary-600' : 'text-slate-700'}`}>
                  {min}
                </Text>
                <Text
                  className={`text-center ${index === idx ? 'text-primary-600' : 'text-slate-700'}`}>
                  minutes
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Custom Duration Button */}
          <Pressable
            onPress={handleCustomPress}
            className={`mx-3 mt-4 rounded-2xl border-4 px-8 py-3 ${
              index === 3 ? 'border-primary-600 bg-primary-100' : 'border-slate-300 bg-slate-100'
            }`}>
            <View className="items-center">
              {index === 3 ? (
                <>
                  <Text className="text-2xl font-bold text-primary-600">{duration}</Text>
                  <Text className="text-primary-600">minutes</Text>
                </>
              ) : (
                <Text className="text-slate-700">Custom</Text>
              )}
            </View>
          </Pressable>
        </View>

        {/* XP Preview */}
        <View className="mb-12 items-center rounded-3xl border-2 border-success-200 bg-success-50 px-12 py-4">
          <Text className="text-lg font-bold text-success-700">You'll earn</Text>
          <Text className="mt-1 text-4xl font-bold text-success-600">+{duration * 2} XP</Text>
          <Text className="mt-1 text-sm text-success-700">Plus streak bonus if completed</Text>
        </View>

        {/* Start Button */}
        <ToggleSwitch
          onToggle={() => {
            router.push({ pathname: '/(tabs)/(home)/timer', params: { duration } });
          }}
          title={'Lock In'}
        />

        {/* Footer / Motivation */}
        <Text className="mt-8 px-6 text-center text-sm text-slate-500">
          Stay consistent! Each minute builds your focus streak.
        </Text>
      </SafeAreaView>

      {/* Custom Duration Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setShowCustomModal(false)}>
          <Pressable className="w-80 rounded-3xl bg-white p-6" onPress={(e) => e.stopPropagation()}>
            <Text className="mb-2 text-center text-2xl font-bold text-slate-800">
              Custom Duration
            </Text>
            <Text className="mb-6 text-center text-sm text-slate-600">
              Enter duration (5-180 minutes)
            </Text>

            <TextInput
              className="mb-6 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-bold text-slate-800"
              placeholder="30"
              keyboardType="number-pad"
              value={customDuration}
              onChangeText={setCustomDuration}
              maxLength={3}
              autoFocus
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  setCustomDuration('');
                  setShowCustomModal(false);
                }}
                className="flex-1 rounded-2xl bg-slate-100 py-4">
                <Text className="text-center font-bold text-slate-700">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleCustomSubmit}
                className="flex-1 rounded-2xl bg-primary-600 py-4">
                <Text className="text-center font-bold text-white">Set Duration</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
