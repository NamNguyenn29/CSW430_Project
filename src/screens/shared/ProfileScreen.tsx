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
import { t } from '../../i18n/translations';

export const ProfileScreen = () => {
  const { theme, language, currentUser, currentRole, reset, navigate } = useApp();
  const colors = COLORS[theme];

  const handleLogout = () => {
    Alert.alert(
      t('logout', language),
      t('logoutConfirm', language),
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: t('logout', language),
          style: 'destructive',
          onPress: () => {
            reset('Welcome');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('account', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* User Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <BadgeIcon name="profile" color={colors.primary} size={48} />
            <View style={styles.infoCol}>
              <Text style={[styles.profileName, { color: colors.text }]}>{currentUser?.name || currentUser?.fullName || 'Người dùng'}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{currentUser?.email}</Text>
              <View style={[styles.roleBadge, { backgroundColor: currentRole === 'student' ? `${colors.primary}15` : `${colors.danger}15` }]}>
                <Text style={[styles.roleText, { color: currentRole === 'student' ? colors.primary : colors.danger }]}>
                  {currentRole === 'student' ? t('student', language) : t('manager', language)}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Account Settings Menu */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile', language)}</Text>
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigate('EditProfile')}>
            <View style={styles.menuItemLeft}>
              <Icon name="edit" color={colors.textSecondary} size={18} style={{ marginRight: SPACING.sm }} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{t('editProfile', language)}</Text>
            </View>
            <Icon name="chevron-right" color={colors.textSecondary} size={16} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.menuItem} onPress={() => navigate('Settings')}>
            <View style={styles.menuItemLeft}>
              <Icon name="settings" color={colors.textSecondary} size={18} style={{ marginRight: SPACING.sm }} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{t('settings', language)}</Text>
            </View>
            <Icon name="chevron-right" color={colors.textSecondary} size={16} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.menuItem} onPress={() => navigate('About')}>
            <View style={styles.menuItemLeft}>
              <Icon name="info" color={colors.textSecondary} size={18} style={{ marginRight: SPACING.sm }} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{t('aboutApp', language)}</Text>
            </View>
            <Icon name="chevron-right" color={colors.textSecondary} size={16} />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: `${colors.danger}40`, backgroundColor: `${colors.danger}0A` }]} onPress={handleLogout}>
          <Icon name="logout" color={colors.danger} size={18} style={{ marginRight: SPACING.xs }} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>{t('logout', language)}</Text>
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
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  menuCard: {
    paddingVertical: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    paddingVertical: SPACING.md - 2,
    marginTop: SPACING.xl,
  },
  logoutText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
});
