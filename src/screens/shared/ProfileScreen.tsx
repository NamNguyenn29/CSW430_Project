import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const ProfileScreen = () => {
  const { theme, currentUser, currentRole, switchRole, reset, navigate } = useApp();
  const colors = COLORS[theme];

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          onPress: () => {
            reset('Welcome');
            Alert.alert('Đã đăng xuất', 'Đã xóa phiên làm việc thành công!');
          }
        }
      ]
    );
  };

  const handleSwitchRole = () => {
    const nextRole = currentRole === 'student' ? 'manager' : 'student';
    switchRole(nextRole);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Tài Khoản" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* User Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <BadgeIcon name="profile" color={colors.primary} size={48} />
            <View style={styles.infoCol}>
              <Text style={[styles.profileName, { color: colors.text }]}>{currentUser.name}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{currentUser.email}</Text>
              <View style={[styles.roleBadge, { backgroundColor: currentRole === 'student' ? `${colors.primary}15` : `${colors.danger}15` }]}>
                <Text style={[styles.roleText, { color: currentRole === 'student' ? colors.primary : colors.danger }]}>
                  {currentRole === 'student' ? 'Sinh Viên' : 'Ban Quản Lý'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Account Settings Menu */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin cá nhân</Text>
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigate('EditProfile')}>
            <View style={styles.menuItemLeft}>
              <Icon name="edit" color={colors.textSecondary} size={18} style={{ marginRight: SPACING.sm }} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Chỉnh sửa hồ sơ</Text>
            </View>
            <Icon name="back" color={colors.textSecondary} size={16} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.menuItem} onPress={() => navigate('Settings')}>
            <View style={styles.menuItemLeft}>
              <Icon name="settings" color={colors.textSecondary} size={18} style={{ marginRight: SPACING.sm }} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Thiết lập ứng dụng</Text>
            </View>
            <Icon name="back" color={colors.textSecondary} size={16} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.menuItem} onPress={() => navigate('About')}>
            <View style={styles.menuItemLeft}>
              <Icon name="info" color={colors.textSecondary} size={18} style={{ marginRight: SPACING.sm }} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Thông tin ứng dụng</Text>
            </View>
            <Icon name="back" color={colors.textSecondary} size={16} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: `${colors.danger}40`, backgroundColor: `${colors.danger}0A` }]} onPress={handleLogout}>
          <Icon name="logout" color={colors.danger} size={18} style={{ marginRight: SPACING.xs }} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Đăng Xuất Tài Khoản</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 80,
  },
  profileCard: {
    padding: SPACING.md,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: SIZES.fontSm,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
    marginTop: 6,
  },
  roleText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  menuCard: {
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginHorizontal: SPACING.sm,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    marginTop: SPACING.xl,
  },
  logoutText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
});
