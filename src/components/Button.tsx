import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING } from '../theme/theme';
import { Icon, IconName } from './Icon';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: IconName | string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const { theme } = useApp();
  const colors = COLORS[theme];

  let mode: 'contained' | 'outlined' | 'text' = 'contained';
  let buttonColor = colors.primary;
  let textColor = '#FFFFFF';

  switch (variant) {
    case 'secondary':
      buttonColor = colors.secondary;
      break;
    case 'danger':
      buttonColor = colors.danger;
      break;
    case 'outline':
      mode = 'outlined';
      buttonColor = 'transparent';
      textColor = colors.primary;
      break;
    default:
      break;
  }

  const renderIcon = (iconProps: { size: number; color: string }) => {
    if (!icon) return null;
    if (typeof icon === 'string' && icon.length > 2) {
      return <Icon name={icon as IconName} size={iconProps.size} color={iconProps.color} />;
    }
    return null;
  };

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      buttonColor={mode === 'contained' ? buttonColor : undefined}
      textColor={textColor}
      style={[
        {
          borderRadius: SIZES.radiusMd,
          marginVertical: SPACING.xs,
          borderColor: mode === 'outlined' ? colors.primary : undefined,
        },
        style,
      ]}
      contentStyle={{ height: 48 }}
      labelStyle={[{ fontSize: SIZES.fontMd, fontWeight: '600' }, textStyle]}
      icon={icon && typeof icon === 'string' && icon.length > 2 ? renderIcon : undefined}
    >
      {title}
    </PaperButton>
  );
};
