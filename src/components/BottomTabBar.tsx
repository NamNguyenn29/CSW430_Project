import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/theme';
import { Icon } from './Icon';

export const BottomTabBar = () => {
  const insets = useSafeAreaInsets();
  const { currentScreen, currentRole, theme, navigate } = useApp();
  const colors = COLORS[theme];

  const handleTabPress = (screen: string) => {
    navigate(screen);
  };

  const renderStudentTabs = () => {
    const tabs = [
      { id: 'StudentHome', label: 'Trang chủ', icon: 'home' },
      { id: 'StudentRoom', label: 'Phòng ở', icon: 'room' },
      { id: 'StudentInvoiceList', label: 'Hóa đơn', icon: 'invoice' },
      { id: 'Profile', label: 'Tài khoản', icon: 'profile' },
    ] as const;

    return tabs.map(tab => {
      const isActive = currentScreen === tab.id;
      const activeColor = colors.primary;
      const inactiveColor = colors.textSecondary;
      const color = isActive ? activeColor : inactiveColor;

      return (
        <TouchableOpacity
          key={tab.id}
          style={styles.tabItem}
          onPress={() => handleTabPress(tab.id)}
        >
          <Icon name={tab.icon} color={color} size={20} />
          <Text style={[styles.tabLabel, { color, fontWeight: isActive ? '700' : '500' }]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const renderAdminTabs = () => {
    const tabs = [
      { id: 'AdminHome', label: 'Trang chủ', icon: 'home' },
      { id: 'AdminRoomList', label: 'Phòng', icon: 'room' },
      { id: 'AdminStudentList', label: 'Sinh viên', icon: 'users' },
      { id: 'Profile', label: 'Hồ sơ', icon: 'profile' },
    ] as const;

    return tabs.map(tab => {
      const isActive = currentScreen === tab.id;
      const activeColor = colors.primary;
      const inactiveColor = colors.textSecondary;
      const color = isActive ? activeColor : inactiveColor;

      return (
        <TouchableOpacity
          key={tab.id}
          style={styles.tabItem}
          onPress={() => handleTabPress(tab.id)}
        >
          <Icon name={tab.icon} color={color} size={20} />
          <Text style={[styles.tabLabel, { color, fontWeight: isActive ? '700' : '500' }]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  // Do not show bottom tab bar on auth screens
  const authScreens = ['Welcome', 'Login', 'Register', 'ForgotPassword'];
  if (authScreens.includes(currentScreen)) {
    return null;
  }

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 54 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 4),
        },
      ]}
    >
      {currentRole === 'student' ? renderStudentTabs() : renderAdminTabs()}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 6,
    zIndex: 100,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 9.5,
    marginTop: 3,
  },
});
