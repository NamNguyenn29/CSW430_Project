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

export const StudentInvoiceListScreen = () => {
  const { theme, currentUser, invoices, navigate } = useApp();
  const colors = COLORS[theme];

  const [activeFilter, setActiveFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  // Filter student room invoices
  const roomInvoices = invoices.filter(i => i.roomId === currentUser.roomId);
  
  const filteredInvoices = roomInvoices.filter(inv => {
    if (activeFilter === 'unpaid') return inv.status === 'Chưa thanh toán' || inv.status === 'Quá hạn';
    if (activeFilter === 'paid') return inv.status === 'Đã thanh toán';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã thanh toán': return colors.success;
      case 'Chưa thanh toán': return colors.warning;
      case 'Quá hạn': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Hóa Đơn Của Tôi" />
      
      {/* Filters bar */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'all' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.textSecondary }]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'unpaid' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveFilter('unpaid')}
        >
          <Text style={[styles.filterText, activeFilter === 'unpaid' ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.textSecondary }]}>
            Chưa thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'paid' && [styles.activeTab, { borderBottomColor: colors.primary }]]}
          onPress={() => setActiveFilter('paid')}
        >
          <Text style={[styles.filterText, activeFilter === 'paid' ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.textSecondary }]}>
            Đã thanh toán
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredInvoices.length === 0 ? (
          <Card style={styles.emptyCard}>
            <BadgeIcon name="invoice" color={colors.textSecondary} size={44} style={{ marginBottom: SPACING.md }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Không tìm thấy hóa đơn</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Không có hóa đơn nào trùng khớp với bộ lọc hiện tại.
            </Text>
          </Card>
        ) : (
          filteredInvoices.map(inv => (
            <Card
              key={inv.id}
              style={styles.invoiceCard}
              onPress={() => navigate('StudentInvoiceDetail', { invoiceId: inv.id })}
            >
              <View style={styles.invoiceRow}>
                <BadgeIcon name="invoice" color={inv.status === 'Đã thanh toán' ? colors.success : colors.warning} size={44} />
                <View style={styles.invoiceInfo}>
                  <Text style={[styles.invoiceTitle, { color: colors.text }]}>
                    Hóa đơn phòng {inv.roomName}
                  </Text>
                  <Text style={[styles.invoiceMonth, { color: colors.textSecondary }]}>
                    Kỳ thanh toán: {inv.month}
                  </Text>
                  <Text style={[styles.invoiceTotal, { color: colors.primary }]}>
                    Tổng: {inv.totalFee.toLocaleString('vi-VN')} đ
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(inv.status)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(inv.status) }]}>
                    {inv.status}
                  </Text>
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
  filterBar: {
    flexDirection: 'row',
    height: 48,
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
    paddingBottom: 80,
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
  invoiceCard: {
    marginVertical: 4,
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  invoiceTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
  },
  invoiceMonth: {
    fontSize: SIZES.fontXs,
    marginVertical: 2,
  },
  invoiceTotal: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
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
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 6,
    zIndex: 100,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 9,
    marginTop: 2,
  },
});
