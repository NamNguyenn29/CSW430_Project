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
import { BadgeIcon } from '../../components/BadgeIcon';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t } from '../../i18n/translations';

export const StudentRequestListScreen = () => {
  const { theme, language, requests, navigate } = useApp();
  const colors = COLORS[theme];

  const myRequests = requests;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã giải quyết': return colors.success;
      case 'Đang xử lý': return colors.primary;
      case 'Chờ xử lý': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === 'en') {
      if (status === 'Đã giải quyết') return 'Resolved';
      if (status === 'Đang xử lý') return 'In Progress';
      if (status === 'Chờ xử lý') return 'Pending';
    }
    return status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Cao': return colors.danger;
      case 'Trung bình': return colors.warning;
      case 'Thấp': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getPriorityLabel = (priority: string) => {
    if (language === 'en') {
      if (priority === 'Cao') return 'High';
      if (priority === 'Trung bình') return 'Medium';
      if (priority === 'Thấp') return 'Low';
    }
    return priority;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Điện':
        return 'zap';
      case 'Nước':
        return 'droplet';
      case 'Thiết bị':
        return 'wrench';
      default:
        return 'alert';
    }
  };

  const getCategoryLabel = (category: string) => {
    if (language === 'en') {
      if (category === 'Điện') return 'Electricity';
      if (category === 'Nước') return 'Water';
      if (category === 'Thiết bị') return 'Equipment';
      if (category === 'Khác') return 'Other';
    }
    return category;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('requestHistory', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Floating action button simulation to add a new request */}
        <Button
          title={t('createNewRequest', language)}
          onPress={() => navigate('StudentAddRequest')}
          variant="primary"
          icon="plus"
          style={{ marginBottom: SPACING.md }}
        />

        {myRequests.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Icon name="inbox" size={48} color={colors.textSecondary} style={{ marginBottom: SPACING.sm }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('emptyRequests', language)}</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              {t('emptyRequestsDesc', language)}
            </Text>
          </Card>
        ) : (
          myRequests.map(req => (
            <Card
              key={req.id}
              style={styles.requestCard}
              onPress={() => navigate('RequestDetail', { reqId: req.id })}
            >
              <View style={styles.requestHeader}>
                <View style={styles.categoryRow}>
                  <BadgeIcon
                    name={getCategoryIcon(req.category) as any}
                    color={getStatusColor(req.status)}
                    size={36}
                  />
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryText, { color: colors.text }]}>
                      {t('incidentType', language)}: {getCategoryLabel(req.category)}
                    </Text>
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                      {language === 'en' ? 'Sent' : 'Gửi ngày'}: {req.createdAt}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(req.status)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(req.status) }]}>
                    {getStatusLabel(req.status)}
                  </Text>
                </View>
              </View>

              <Text style={[styles.requestTitle, { color: colors.text }]} numberOfLines={1}>
                {req.title}
              </Text>
              
              <Text style={[styles.requestDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                {req.description}
              </Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.footerRow}>
                <View style={styles.priorityContainer}>
                  <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>{t('priority', language)}: </Text>
                  <Text style={[styles.priorityText, { color: getPriorityColor(req.priority) }]}>
                    {getPriorityLabel(req.priority)}
                  </Text>
                </View>
                <View style={styles.detailLink}>
                  <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
                    {t('details', language)}
                  </Text>
                  <Icon name="chevron-right" color={colors.primary} size={14} style={{ marginLeft: 2 }} />
                </View>
              </View>
            </Card>
          ))
        )}
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
    paddingBottom: 90,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  emptyTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
  },
  emptyDesc: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  requestCard: {
    marginVertical: SPACING.xs,
    padding: SPACING.md,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  categoryText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
  dateText: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  requestTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
  },
  requestDesc: {
    fontSize: SIZES.fontSm,
    marginTop: 2,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: SIZES.fontXs,
  },
  priorityText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
});
