import React from 'react';
import { StyleProp, ViewStyle, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const { theme } = useApp();
  const colors = COLORS[theme];

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: SIZES.radiusMd,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};
