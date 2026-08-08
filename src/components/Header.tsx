import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SPACING } from '../theme/theme';
import { Icon } from './Icon';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => {
  const insets = useSafeAreaInsets();
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    currentRole,
    goBack,
    navigate,
    announcements,
  } = useApp();

  const colors = COLORS[theme];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          height: 52 + insets.top,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* Absolute Left Row */}
      <View style={[styles.leftRow, { top: insets.top }]}>
        {showBack ? (
          <TouchableOpacity
            onPress={goBack}
            style={styles.iconButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Icon name="back" color={colors.text} size={22} />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: currentRole === 'student' ? `${colors.primary}12` : `${colors.danger}12`, borderColor: currentRole === 'student' ? colors.primary : colors.danger },
            ]}
          >
            <View style={styles.roleContent}>
              <Icon
                name={currentRole === 'student' ? 'profile' : 'settings'}
                color={currentRole === 'student' ? colors.primary : colors.danger}
                size={12}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.roleText, { color: currentRole === 'student' ? colors.primary : colors.danger }]}>
                {currentRole === 'student' ? 'Sinh Viên' : 'Quản Lý'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Centered Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Absolute Right Row */}
      <View style={[styles.rightRow, { top: insets.top }]}>
        {/* Language Toggler */}
        <TouchableOpacity
          onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          style={[styles.iconButton, styles.langToggle]}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <Icon name="globe" color={colors.textSecondary} size={16} />
          <Text style={[styles.langText, { color: colors.textSecondary }]}>
            {language === 'vi' ? 'VI' : 'EN'}
          </Text>
        </TouchableOpacity>

        {/* Theme Toggler */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} color={colors.textSecondary} size={16} />
        </TouchableOpacity>

        {/* Notifications Icon */}
        <TouchableOpacity
          onPress={() => navigate('Notifications')}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <Icon name="bell" color={colors.textSecondary} size={16} />
          {announcements && announcements.length > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{announcements.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    zIndex: 10,
    position: 'relative',
  },
  leftRow: {
    position: 'absolute',
    left: SPACING.sm,
    height: 52,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '50%',
  },
  title: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  rightRow: {
    position: 'absolute',
    right: SPACING.sm,
    height: 52,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: SPACING.xs,
    marginLeft: 2,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: '#DC2626',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: 'bold',
  },
});
