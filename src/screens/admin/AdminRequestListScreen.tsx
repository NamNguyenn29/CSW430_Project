import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle } from '../../i18n/translations';

export const AdminRequestListScreen = () => {
  const { theme, language, requests, navigate } = useApp();
  const colors = COLORS[theme];

  const [activeFilter, setActiveFilter] = useState<'Chờ xử lý' | 'Đang xử lý' | 'Đã giải quyết' | 'Tất cả'>('Tất cả');

  // Filter requests
  const filteredRequests = requests.filter(req => {
    return activeFilter === 'Tất cả' || req.status === activeFilter;
  });

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
      if (status === 'Tất cả') return 'All';
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={language === 'en' ? 'Incident Management' : 'Quản Lý Sự Cố KTX'} showBack />

      {/* Filter Tabs */}
      <View style={[styles.filterBarContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsRow}>
          {(['Tất cả', 'Chờ xử lý', 'Đang xử lý', 'Đã giải quyết'] as const).map(filter => {
            const count = filter === 'Tất cả' ? requests.length : requests.filter(r => r.status === filter).length;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  { borderColor: colors.border },
                  activeFilter === filter && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter ? { color: '#FFF' } : { color: colors.text }]}>
                  {getStatusLabel(filter)} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.listTitle, { color: colors.text }]}>
          {language === 'en' ? `Incident Reports (${filteredRequests.length})` : `Danh sách báo hỏng (${filteredRequests.length})`}
        </Text>

        {filteredRequests.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Icon name="wrench" size={48} color={colors.textSecondary} style={{ marginBottom: SPACING.sm }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {language === 'en' ? 'No incident reports' : 'Không có sự cố nào'}
            </Text>
          </Card>
        ) : (
          filteredRequests.map(req => (
            <Card
              key={req.id}
              style={styles.requestCard}
              onPress={() => navigate('RequestDetail', { reqId: req.id })}
            >
              <View style={styles.requestHeader}>
                <View style={styles.roomBadgeRow}>
                  <Text style={[styles.roomNameText, { color: colors.primary }]}>
                    {formatRoomTitle(req.roomName, language)} ({req.block})
                  </Text>
                  <Text style={[styles.reporterText, { color: colors.textSecondary }]}>
                    - {req.reporter}
                  </Text>
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
  filterBarContainer: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
  },
  filterTabsRow: {
    flexDirection: 'row',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    marginRight: SPACING.xs,
  },
  filterText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 80,
  },
  listTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.md,
  },
  emptyTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  requestCard: {
    marginBottom: SPACING.sm,
    padding: SPACING.md,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomNameText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
  reporterText: {
    fontSize: SIZES.fontXs,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
  },
  statusText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
  requestTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
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
    fontWeight: '700',
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
});
