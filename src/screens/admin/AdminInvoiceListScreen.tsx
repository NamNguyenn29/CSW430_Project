import React, { useState } from 'react';
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
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle, formatMonthPeriod } from '../../i18n/translations';

export const AdminInvoiceListScreen = () => {
  const { theme, language, invoices, payInvoice, navigate } = useApp();
  const colors = COLORS[theme];

  const [activeFilter, setActiveFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'unpaid'
        ? inv.status === 'Chưa thanh toán' || inv.status === 'Quá hạn'
        : inv.status === 'Đã thanh toán';

    const matchSearch =
      !searchQuery.trim() ||
      inv.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.month.toLowerCase().includes(searchQuery.toLowerCase());

    return matchFilter && matchSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã thanh toán':
        return colors.success;
      case 'Chưa thanh toán':
        return colors.warning;
      case 'Quá hạn':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const handleMarkAsPaid = (invId: string, roomName: string, month: string) => {
    const roomTitle = formatRoomTitle(roomName, language);
    const monthTitle = formatMonthPeriod(month, language);
    Alert.alert(
      language === 'en' ? 'Confirm Payment' : 'Xác nhận thu tiền',
      language === 'en'
        ? `Mark invoice for ${roomTitle} (${monthTitle}) as Paid?`
        : `Xác nhận đã thu đủ tiền hóa đơn ${roomTitle} (${monthTitle})?`,
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: t('confirm', language),
          onPress: () => {
            payInvoice(invId);
            Alert.alert(
              t('success', language),
              t('markPaidSuccess', language)
            );
          },
        },
      ]
    );
  };

  const totalUnpaid = invoices
    .filter(i => i.status === 'Chưa thanh toán' || i.status === 'Quá hạn')
    .reduce((sum, i) => sum + i.totalFee, 0);

  const unpaidCount = invoices.filter(i => i.status !== 'Đã thanh toán').length;
  const paidCount = invoices.filter(i => i.status === 'Đã thanh toán').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('allInvoices', language)} showBack />

      {/* Top Premium Summary Banner */}
      <View style={[styles.topBanner, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.revenueInfo}>
          <Text style={[styles.revenueLabel, { color: colors.textSecondary }]}>
            {t('unpaidRevenue', language)}
          </Text>
          <Text style={[styles.revenueValue, { color: colors.danger }]}>
            {totalUnpaid.toLocaleString('vi-VN')} đ
          </Text>
          <Text style={[styles.revenueSub, { color: colors.textSecondary }]}>
            {t('unpaidCountSummary', language, { count: unpaidCount })}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigate('AdminAddInvoice')}
          activeOpacity={0.85}
        >
          <Icon name="plus" color="#FFFFFF" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.createBtnText}>{t('createInvoice', language)}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Input
          placeholder={t('searchRoomPlaceholder', language)}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
          containerStyle={{ marginVertical: 0 }}
        />
      </View>

      {/* Segmented Filter Tabs */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'all' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' ? { color: colors.primary, fontWeight: '700' } : { color: colors.textSecondary }]}>
            {t('all', language)} ({invoices.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'unpaid' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveFilter('unpaid')}
        >
          <Text style={[styles.filterText, activeFilter === 'unpaid' ? { color: colors.primary, fontWeight: '700' } : { color: colors.textSecondary }]}>
            {t('unpaid', language)} ({unpaidCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'paid' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveFilter('paid')}
        >
          <Text style={[styles.filterText, activeFilter === 'paid' ? { color: colors.primary, fontWeight: '700' } : { color: colors.textSecondary }]}>
            {t('paid', language)} ({paidCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Invoices List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredInvoices.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Icon name="inbox" size={48} color={colors.textSecondary} style={{ marginBottom: SPACING.sm }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('noInvoicesFound', language)}</Text>
          </Card>
        ) : (
          filteredInvoices.map(inv => {
            const isPaid = inv.status === 'Đã thanh toán';
            const statusColor = getStatusColor(inv.status);
            return (
              <Card key={inv.id} style={styles.invoiceCard}>
                {/* Header of the Invoice Card */}
                <View style={styles.cardHeader}>
                  <View style={styles.roomBadgeRow}>
                    <BadgeIcon
                      name="invoice"
                      color={statusColor}
                      size={36}
                    />
                    <View style={styles.roomMeta}>
                      <Text style={[styles.roomNameText, { color: colors.text }]}>
                        {formatRoomTitle(inv.roomName, language)}
                      </Text>
                      <Text style={[styles.monthText, { color: colors.textSecondary }]}>
                        {t('billingPeriod', language)}: {formatMonthPeriod(inv.month, language)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                      {isPaid ? t('paid', language) : t('unpaid', language)}
                    </Text>
                  </View>
                </View>

                {/* Breakdown Mini Row */}
                <View style={[styles.breakdownRow, { backgroundColor: theme === 'light' ? '#F8FAFC' : '#1E293B' }]}>
                  <View style={styles.breakdownItem}>
                    <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>{t('rentFee', language)}</Text>
                    <Text style={[styles.breakdownValue, { color: colors.text }]}>{inv.rentFee.toLocaleString('vi-VN')} đ</Text>
                  </View>
                  <View style={styles.breakdownItem}>
                    <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>{t('electricityFee', language)}</Text>
                    <Text style={[styles.breakdownValue, { color: colors.text }]}>{inv.electricityFee.toLocaleString('vi-VN')} đ</Text>
                  </View>
                  <View style={styles.breakdownItem}>
                    <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>{t('waterFee', language)}</Text>
                    <Text style={[styles.breakdownValue, { color: colors.text }]}>{inv.waterFee.toLocaleString('vi-VN')} đ</Text>
                  </View>
                </View>

                {/* Footer with Total and Action Button */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>{t('totalFee', language)}</Text>
                    <Text style={[styles.totalAmount, { color: isPaid ? colors.success : colors.danger }]}>
                      {inv.totalFee.toLocaleString('vi-VN')} đ
                    </Text>
                  </View>

                  {!isPaid && (
                    <TouchableOpacity
                      style={[styles.payActionBtn, { backgroundColor: `${colors.primary}12`, borderColor: colors.primary }]}
                      onPress={() => handleMarkAsPaid(inv.id, inv.roomName, inv.month)}
                      activeOpacity={0.8}
                    >
                      <Icon name="check" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.payActionText, { color: colors.primary }]}>
                        {t('markAsPaid', language)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
  },
  revenueInfo: {
    flex: 1,
  },
  revenueLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  revenueValue: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    marginTop: 2,
  },
  revenueSub: {
    fontSize: 10,
    marginTop: 1,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    borderRadius: SIZES.radiusSm + 2,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
  searchBox: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
  },
  filterBar: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
  },
  filterTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2.5,
  },
  filterText: {
    fontSize: SIZES.fontSm,
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
  invoiceCard: {
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: SIZES.radiusMd,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomMeta: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  roomNameText: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
  },
  monthText: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderRadius: SIZES.radiusSm,
    marginVertical: SPACING.sm,
  },
  breakdownItem: {
    alignItems: 'flex-start',
  },
  breakdownLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
  },
  payActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
  },
  payActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
