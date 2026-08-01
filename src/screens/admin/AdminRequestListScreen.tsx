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
import { BadgeIcon } from '../../components/BadgeIcon';
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const AdminRequestListScreen = () => {
  const { theme, requests, navigate } = useApp();
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Cao': return colors.danger;
      case 'Trung bình': return colors.warning;
      case 'Thấp': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Quản Lý Sự Cố KTX" />

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
                  {filter} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.listTitle, { color: colors.text }]}>
          Danh sách báo hỏng ({filteredRequests.length})
        </Text>

        {filteredRequests.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🔧</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Không có sự cố nào</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Không tìm thấy sự cố nào khớp với bộ lọc hiện tại.
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
                    Phòng {req.roomName} ({req.block})
                  </Text>
                  <Text style={[styles.reporterText, { color: colors.textSecondary }]}>
                    - {req.reporter}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(req.status)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(req.status) }]}>
                    {req.status}
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
                  <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Độ ưu tiên: </Text>
                  <Text style={[styles.priorityText, { color: getPriorityColor(req.priority) }]}>
                    {req.priority}
                  </Text>
                </View>
                <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                  {req.createdAt}
                </Text>
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
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  filterTabsRow: {
    flexDirection: 'row',
  },
  filterTab: {
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  filterText: {
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 80,
  },
  listTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: SIZES.fontXs,
    textAlign: 'center',
  },
  requestCard: {
    marginVertical: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  roomBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomNameText: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  reporterText: {
    fontSize: SIZES.fontXs,
    marginLeft: 4,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 8.5,
    fontWeight: 'bold',
  },
  requestTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  requestDesc: {
    fontSize: SIZES.fontXs,
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
  dateText: {
    fontSize: SIZES.fontXs,
  },
});
