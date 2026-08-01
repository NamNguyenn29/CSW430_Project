import React from 'react';
import { StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { TextInput as PaperInput, HelperText } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING } from '../theme/theme';
import { Icon, IconName } from './Icon';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  icon?: IconName | string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  textAlignVertical?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  containerStyle,
  inputStyle,
  icon,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  multiline,
  numberOfLines,
  editable = true,
}) => {
  const { theme } = useApp();
  const colors = COLORS[theme];

  const renderIcon = (iconProps: { size: number; color: string }) => {
    if (!icon) return null;
    if (typeof icon === 'string' && icon.length > 2) {
      return <Icon name={icon as IconName} size={iconProps.size} color={iconProps.color} />;
    }
    return null;
  };

  return (
    <View style={[{ marginVertical: SPACING.xs, width: '100%' }, containerStyle]}>
      <PaperInput
        mode="outlined"
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        disabled={!editable}
        left={icon && typeof icon === 'string' && icon.length > 2 ? (
          <PaperInput.Icon icon={renderIcon} />
        ) : undefined}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        textColor={colors.text}
        placeholderTextColor={colors.textSecondary}
        style={[
          {
            backgroundColor: colors.surface,
          },
          inputStyle,
        ]}
      />
      {error ? (
        <HelperText type="error" visible={!!error} style={{ fontSize: SIZES.fontXs }}>
          {error}
        </HelperText>
      ) : null}
    </View>
  );
};
