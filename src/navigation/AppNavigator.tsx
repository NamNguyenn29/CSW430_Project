import React, { useEffect } from 'react';
import { View, StyleSheet, Text, BackHandler } from 'react-native';
import { useApp } from '../context/AppContext';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

import { StudentHomeScreen } from '../screens/student/StudentHomeScreen';
import { StudentRoomScreen } from '../screens/student/StudentRoomScreen';
import { StudentInvoiceListScreen } from '../screens/student/StudentInvoiceListScreen';
import { StudentInvoiceDetailScreen } from '../screens/student/StudentInvoiceDetailScreen';
import { StudentRequestListScreen } from '../screens/student/StudentRequestListScreen';
import { StudentAddRequestScreen } from '../screens/student/StudentAddRequestScreen';

import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { AdminRoomListScreen } from '../screens/admin/AdminRoomListScreen';
import { AdminRoomDetailScreen } from '../screens/admin/AdminRoomDetailScreen';
import { AdminStudentListScreen } from '../screens/admin/AdminStudentListScreen';
import { AdminStudentDetailScreen } from '../screens/admin/AdminStudentDetailScreen';
import { AdminRequestListScreen } from '../screens/admin/AdminRequestListScreen';
import { AdminAddInvoiceScreen } from '../screens/admin/AdminAddInvoiceScreen';

import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { EditProfileScreen } from '../screens/shared/EditProfileScreen';
import { SettingsScreen } from '../screens/shared/SettingsScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { NotificationDetailScreen } from '../screens/shared/NotificationDetailScreen';
import { AboutScreen } from '../screens/shared/AboutScreen';
import { RequestDetailScreen } from '../screens/shared/RequestDetailScreen';

import { COLORS } from '../theme/theme';

export const AppNavigator = () => {
  const { currentScreen, theme, goBack } = useApp();
  const colors = COLORS[theme];

  useEffect(() => {
    const backAction = () => {
      const topScreens = ['Welcome', 'Login', 'StudentHome', 'AdminHome'];
      if (topScreens.includes(currentScreen)) {
        return false;
      }
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentScreen, goBack]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Welcome':
        return <WelcomeScreen />;
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <RegisterScreen />;
      case 'ForgotPassword':
        return <ForgotPasswordScreen />;
      
      case 'StudentHome':
        return <StudentHomeScreen />;
      case 'StudentRoom':
        return <StudentRoomScreen />;
      case 'StudentInvoiceList':
        return <StudentInvoiceListScreen />;
      case 'StudentInvoiceDetail':
        return <StudentInvoiceDetailScreen />;
      case 'StudentRequestList':
        return <StudentRequestListScreen />;
      case 'StudentAddRequest':
        return <StudentAddRequestScreen />;

      case 'AdminHome':
        return <AdminHomeScreen />;
      case 'AdminRoomList':
        return <AdminRoomListScreen />;
      case 'AdminRoomDetail':
        return <AdminRoomDetailScreen />;
      case 'AdminStudentList':
        return <AdminStudentListScreen />;
      case 'AdminStudentDetail':
        return <AdminStudentDetailScreen />;
      case 'AdminRequestList':
        return <AdminRequestListScreen />;
      case 'AdminAddInvoice':
        return <AdminAddInvoiceScreen />;

      case 'Profile':
        return <ProfileScreen />;
      case 'EditProfile':
        return <EditProfileScreen />;
      case 'Settings':
        return <SettingsScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'NotificationDetail':
        return <NotificationDetailScreen />;
      case 'About':
        return <AboutScreen />;
      case 'RequestDetail':
        return <RequestDetailScreen />;

      default:
        return (
          <View style={[styles.fallback, { backgroundColor: colors.background }]}>
            <Text style={{ color: colors.text }}>Screen not found: {currentScreen}</Text>
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
