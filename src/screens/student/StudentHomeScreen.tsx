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
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const StudentHomeScreen = () => {
  const { theme, currentUser, invoices, announcements, requests, navigate } = useApp();
  const colors = COLORS[theme];

  const roomInvoices = invoices.filter(i => i.roomId === currentUser.roomId);
  const unpaidCount = roomInvoices.filter(i => i.status === 'Chưa thanh toán').length;
  const activeRequests = requests.filter(
    r => r.roomId === currentUser.roomId && r.status !== 'Đã giải quyết'
  ).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Trang Chủ" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.welcomeSub}>Xin chào,</Text>
              <Text style={styles.welcomeName}>{currentUser.name}</Text>
              <Text style={styles.welcomeRoom}>
                Phòng {currentUser.roomName || 'Chưa xếp'} • {currentUser.block || 'Khu A'}
              </Text>
            </View>
            <View style={styles.avatarCircle}>
              <Icon name="profile" color="#FFFFFF" size={28} />
            </View>
          </View>
        </Card>

        {/* Quick Utilities Overview */}
        <View style={styles.summaryContainer}>
          <Card
            style={styles.summaryBox}
            onPress={() => navigate('StudentInvoiceList')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="invoice" color="#D97706" size={34} />
              <Text style={[styles.summaryTitle, { color: colors.textSecondary }]}>Hóa đơn chờ</Text>
              <Text style={[styles.summaryVal, { color: unpaidCount > 0 ? colors.danger : colors.success }]}>
                {unpaidCount} hóa đơn
              </Text>
            </View>
          </Card>

          <Card
            style={styles.summaryBox}
            onPress={() => navigate('StudentRequestList')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="settings" color="#2563EB" size={34} />
              <Text style={[styles.summaryTitle, { color: colors.textSecondary }]}>Yêu cầu sửa chữa</Text>
              <Text style={[styles.summaryVal, { color: colors.text }]}>
                {activeRequests} đang xử lý
              </Text>
            </View>
          </Card>
        </View>

        {/* Quick actions grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Dịch vụ Kí túc xá</Text>
        <View style={styles.actionGrid}>
          <Card
            style={styles.actionItem}
            onPress={() => navigate('StudentRoom')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="users" color="#2563EB" size={36} style={styles.actionIcon} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Phòng & Bạn ở</Text>
            </View>
          </Card>

          <Card
            style={styles.actionItem}
            onPress={() => navigate('StudentInvoiceList')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="invoice" color="#10B981" size={36} style={styles.actionIcon} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Thanh toán tiền</Text>
            </View>
          </Card>

          <Card
            style={styles.actionItem}
            onPress={() => navigate('StudentAddRequest')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="plus" color="#8B5CF6" size={36} style={styles.actionIcon} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Báo hỏng hóc</Text>
            </View>
          </Card>

          <Card
            style={styles.actionItem}
            onPress={() => navigate('Settings')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="settings" color="#64748B" size={36} style={styles.actionIcon} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Thiết lập</Text>
            </View>
          </Card>
        </View>

        {/* Announcements list */}
        <View style={styles.announcementHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông báo từ BQL</Text>
          <Card style={{ paddingHorizontal: 10, paddingVertical: 4, marginVertical: 0 }} onPress={() => navigate('Notifications')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Xem tất cả</Text>
          </Card>
        </View>

        {announcements.slice(0, 2).map((ann) => (
          <Card
            key={ann.id}
            style={styles.annCard}
            onPress={() => navigate('NotificationDetail', { announcement: ann })}
          >
            <View style={styles.annTitleRow}>
              {ann.priority === 'important' && (
                <View style={styles.importantBadge}>
                  <Text style={styles.importantText}>Quan trọng</Text>
                </View>
              )}
              <Text style={[styles.annDate, { color: colors.textSecondary }]}>{ann.date}</Text>
            </View>
            <Text style={[styles.annTitle, { color: colors.text }]} numberOfLines={1}>
              {ann.title}
            </Text>
            <Text style={[styles.annDesc, { color: colors.textSecondary }]} numberOfLines={2}>
              {ann.content}
            </Text>
          </Card>
        ))}

        {/* Info card block */}
        <Card style={[styles.infoBanner, { backgroundColor: `${colors.primary}0D`, borderColor: `${colors.primary}30` }]}>
          <Icon name="info" color={colors.primary} size={24} style={{ marginRight: SPACING.sm }} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.primary }]}>Nội quy KTX</Text>
            <Text style={[styles.infoText, { color: colors.text }]}>
              Giờ giới nghiêm: 23:00 tối hàng ngày. Hãy nhớ mang theo thẻ sinh viên khi ra vào kí túc xá!
            </Text>
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
    paddingBottom: 80,
  },
  welcomeCard: {
    backgroundColor: '#2563EB',
    borderWidth: 0,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSub: {
    color: '#93C5FD',
    fontSize: SIZES.fontSm,
  },
  welcomeName: {
    color: '#FFFFFF',
    fontSize: SIZES.fontXl,
    fontWeight: '700',
    marginVertical: 2,
  },
  welcomeRoom: {
    color: '#DBEAFE',
    fontSize: SIZES.fontSm,
    fontWeight: '500',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -SPACING.xs,
  },
  summaryBox: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  summaryTitle: {
    fontSize: SIZES.fontXs,
    marginTop: SPACING.xs,
  },
  summaryVal: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xs,
  },
  actionIcon: {
    marginBottom: SPACING.xs,
  },
  actionLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
    textAlign: 'center',
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  seeAllText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
  annCard: {
    marginVertical: SPACING.xs,
  },
  annTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  importantBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  importantText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '700',
  },
  annDate: {
    fontSize: SIZES.fontXs,
  },
  annTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    marginBottom: 2,
  },
  annDesc: {
    fontSize: SIZES.fontSm,
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    marginBottom: 2,
  },
  infoText: {
    fontSize: SIZES.fontXs,
    lineHeight: 16,
  },
});
