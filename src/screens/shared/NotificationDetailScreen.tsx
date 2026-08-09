import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t } from '../../i18n/translations';

export const NotificationDetailScreen = () => {
  const { theme, language, screenParams } = useApp();
  const colors = COLORS[theme];

  const { announcement } = screenParams;

  if (!announcement) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={language === 'en' ? 'Announcement Details' : 'Chi Tiết Thông Báo'} showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{language === 'en' ? 'Announcement not found.' : 'Không tìm thấy thông báo này.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={language === 'en' ? 'Announcement Details' : 'Chi Tiết Thông Báo'} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <View style={styles.headerRow}>
            {announcement.priority === 'important' && (
              <View style={styles.importantBadge}>
                <Text style={styles.importantBadgeText}>{t('important', language)}</Text>
              </View>
            )}
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              {language === 'en' ? 'Posted on' : 'Đăng ngày'}: {announcement.date}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{announcement.title}</Text>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.contentBody, { color: colors.text }]}>{announcement.content}</Text>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.footerRow}>
            <Text style={[styles.signatureLabel, { color: colors.textSecondary }]}>{language === 'en' ? 'Issuer' : 'Người ban hành'}</Text>
            <Text style={[styles.signatureValue, { color: colors.primary }]}>{announcement.author}</Text>
          </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: SIZES.fontMd,
  },
  card: {
    padding: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  importantBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  importantBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: SIZES.fontXs,
  },
  title: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  contentBody: {
    fontSize: SIZES.fontSm,
    lineHeight: 22,
  },
  footerRow: {
    alignItems: 'flex-end',
    marginTop: SPACING.md,
  },
  signatureLabel: {
    fontSize: 10.5,
    fontStyle: 'italic',
  },
  signatureValue: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
