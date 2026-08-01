import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const StudentInvoiceDetailScreen = () => {
  const { theme, screenParams, invoices, payInvoice } = useApp();
  const colors = COLORS[theme];

  const { invoiceId } = screenParams;
  const invoice = invoices.find(i => i.id === invoiceId);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!invoice) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Hóa Đơn Chi Tiết" showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Không tìm thấy thông tin hóa đơn này.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePayment = () => {
    Alert.alert(
      'Xác nhận thanh toán',
      `Bạn có chắc chắn muốn thanh toán hóa đơn với số tiền ${invoice.totalFee.toLocaleString('vi-VN')} đ?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thanh toán',
          onPress: () => {
            setIsProcessing(true);
            setTimeout(() => {
              setIsProcessing(false);
              payInvoice(invoice.id);
              Alert.alert('Thanh toán thành công', 'Hóa đơn đã được thanh toán và cập nhật trên hệ thống!');
            }, 1200);
          }
        }
      ]
    );
  };

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
      <Header title="Hóa Đơn Chi Tiết" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Invoice Header */}
        <Card style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={[styles.title, { color: colors.text }]}>Phòng {invoice.roomName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(invoice.status)}20` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>{invoice.status}</Text>
            </View>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Kỳ hóa đơn: {invoice.month}</Text>
          {invoice.paidAt && (
            <Text style={[styles.paidAtText, { color: colors.success }]}>
              Thanh toán ngày: {invoice.paidAt}
            </Text>
          )}
        </Card>

        {/* Detailed Items breakdown */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Chi tiết khoản phí</Text>
        <Card style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>Tiền thuê phòng</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {invoice.rentFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>Tiền điện</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {invoice.electricityFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>Tiền nước</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {invoice.waterFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>Tiền dịch vụ (Wifi, vệ sinh)</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {invoice.serviceFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={[styles.lineDivider, { backgroundColor: colors.border }]} />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Tổng số tiền phải nộp</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {invoice.totalFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </Card>

        {/* QR Code payment or Paid stamp */}
        {invoice.status !== 'Đã thanh toán' ? (
          <View style={styles.paymentSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quét mã QR để chuyển khoản nhanh</Text>
            <Card style={styles.qrCard}>
              <Image
                source={{ uri: invoice.paymentQrCodeUrl }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <Text style={[styles.qrHelperText, { color: colors.textSecondary }]}>
                Mở ứng dụng Ngân hàng hoặc Ví điện tử quét mã QR này
              </Text>
            </Card>

            <Button
              title="Tôi đã chuyển khoản (Xác nhận)"
              onPress={handlePayment}
              loading={isProcessing}
              variant="primary"
              style={{ marginTop: SPACING.md }}
            />
          </View>
        ) : (
          <Card style={[styles.successStampCard, { borderColor: colors.success, backgroundColor: `${colors.success}10` }]}>
            <Text style={styles.stampIcon}>✅</Text>
            <Text style={[styles.stampTitle, { color: colors.success }]}>ĐÃ THANH TOÁN THÀNH CÔNG</Text>
            <Text style={[styles.stampDesc, { color: colors.text }]}>
              Cảm ơn bạn! Hóa đơn này đã được ghi nhận thanh toán đầy đủ trên hệ thống quản lý phòng kí túc xá.
            </Text>
          </Card>
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: SIZES.fontMd,
  },
  infoCard: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.fontXl,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: SIZES.fontSm,
    marginTop: 4,
  },
  paidAtText: {
    fontSize: SIZES.fontXs,
    fontWeight: '500',
    marginTop: 6,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  breakdownCard: {
    paddingVertical: SPACING.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  itemLabel: {
    fontSize: SIZES.fontSm,
  },
  itemValue: {
    fontSize: SIZES.fontSm,
    fontWeight: '500',
  },
  lineDivider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  totalLabel: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
  },
  paymentSection: {
    alignItems: 'center',
    width: '100%',
  },
  qrCard: {
    width: '100%',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  qrHelperText: {
    fontSize: SIZES.fontXs,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 16,
  },
  successStampCard: {
    alignItems: 'center',
    borderWidth: 1.5,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: SIZES.radiusLg,
  },
  stampIcon: {
    fontSize: 44,
    marginBottom: SPACING.sm,
  },
  stampTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  stampDesc: {
    fontSize: SIZES.fontXs,
    textAlign: 'center',
    lineHeight: 18,
  },
});
