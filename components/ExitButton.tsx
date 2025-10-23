import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ExitButtonProps {
  onPress: () => void;
}

const ExitButton: React.FC<ExitButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full bg-slate-200">
      <Text className="text-xl text-dark-text-secondary">✕</Text>
    </TouchableOpacity>
  );
};

export default ExitButton;
