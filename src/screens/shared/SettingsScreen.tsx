import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t } from '../../i18n/translations';

export const SettingsScreen = () => {
  const { theme, toggleTheme, language, setLanguage } = useApp();
  const colors = COLORS[theme];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title={t('settings', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Appearance Configuration */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('appearanceAndLang', language)}
        </Text>
        <Card style={styles.card}>
          {/* Dark Mode Row */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('darkMode', language)}
              </Text>
              <Text
                style={[styles.settingDesc, { color: colors.textSecondary }]}
              >
                {t('darkModeDesc', language)}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={theme === 'dark' ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Language Selection Row */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('appLanguage', language)}
              </Text>
              <Text
                style={[styles.settingDesc, { color: colors.textSecondary }]}
              >
                {t('appLanguageDesc', language)}
              </Text>
            </View>
            <View
              style={[
                styles.langToggleContainer,
                { borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.langOption,
                  language === 'vi' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setLanguage('vi')}
              >
                <Text
                  style={[
                    styles.langText,
                    language === 'vi'
                      ? { color: '#FFF' }
                      : { color: colors.text },
                  ]}
                >
                  VI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langOption,
                  language === 'en' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.langText,
                    language === 'en'
                      ? { color: '#FFF' }
                      : { color: colors.text },
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Account security */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('accountSecurity', language)}
        </Text>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert(
                t('changePassword', language),
                language === 'en'
                  ? 'Online password change feature.'
                  : 'Tính năng thay đổi mật khẩu tài khoản trực tuyến.',
              )
            }
          >
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('changePassword', language)}
              </Text>
              <Text
                style={[styles.settingDesc, { color: colors.textSecondary }]}
              >
                {t('changePasswordDesc', language)}
              </Text>
            </View>
            <Icon
              name="back"
              color={colors.textSecondary}
              size={16}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>
        </Card>
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
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  card: {
    paddingVertical: SPACING.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.sm,
  },
  settingLeft: {
    flex: 1.5,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
  },
  langToggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    overflow: 'hidden',
  },
  langOption: {
    width: 32,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
