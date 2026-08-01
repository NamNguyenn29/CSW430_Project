import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../theme/theme';
import { Icon, IconName } from './Icon';

interface BadgeIconProps {
  name: IconName;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  name,
  color = '#4F46E5',
  size = 40,
  style,
}) => {
  const containerSize = size;
  const iconSize = size * 0.5;

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: `${color}15`, // Light opacity background
          borderColor: `${color}30`,
          borderWidth: 1,
        },
        style,
      ]}
    >
      <Icon name={name} color={color} size={iconSize} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
