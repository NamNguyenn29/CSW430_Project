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

export const NotificationsScreen = () => {
  const { theme, language, announcements, navigate } = useApp();
  const colors = COLORS[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('notifications', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.listTitle, { color: colors.text }]}>
          {t('announcementsFromBQL', language)} ({announcements.length})
        </Text>

        {announcements.map((ann) => (
          <Card
            key={ann.id}
            style={styles.annCard}
            onPress={() => navigate('NotificationDetail', { announcement: ann })}
          >
            <View style={styles.annHeader}>
              <View style={styles.badgeRow}>
                {ann.priority === 'important' && (
                  <View style={styles.importantBadge}>
                    <Text style={styles.importantBadgeText}>{t('important', language)}</Text>
                  </View>
                )}
                <Text style={[styles.authorText, { color: colors.primary }]}>{ann.author}</Text>
              </View>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>{ann.date}</Text>
            </View>

            <Text style={[styles.annTitle, { color: colors.text }]} numberOfLines={1}>
              {ann.title}
            </Text>
            
            <Text style={[styles.annDesc, { color: colors.textSecondary }]} numberOfLines={2}>
              {ann.content}
            </Text>
          </Card>
        ))}
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
  listTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  annCard: {
    marginVertical: 4,
  },
  annHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  importantBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  importantBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  authorText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: SIZES.fontXs,
  },
  annTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  annDesc: {
    fontSize: SIZES.fontXs,
    lineHeight: 16,
  },
});
