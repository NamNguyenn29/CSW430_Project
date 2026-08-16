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
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle, formatMonthPeriod } from '../../i18n/translations';

export const StudentInvoiceDetailScreen = () => {
  const { theme, language, screenParams, invoices, payInvoice } = useApp();
  const colors = COLORS[theme];

  const { invoiceId } = screenParams;
  const invoice = invoices.find(i => i.id === invoiceId);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!invoice) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={t('invoiceDetail', language)} showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{t('noInvoicesFound', language)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPaid = invoice.status === 'Đã thanh toán';

  const handlePayment = () => {
    Alert.alert(
      language === 'en' ? 'Confirm Payment' : 'Xác nhận thanh toán',
      language === 'en'
        ? `Confirm payment of ${invoice.totalFee.toLocaleString('vi-VN')} VND for this invoice?`
        : `Bạn có chắc chắn muốn thanh toán hóa đơn với số tiền ${invoice.totalFee.toLocaleString('vi-VN')} đ?`,
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: t('payNow', language),
          onPress: () => {
            setIsProcessing(true);
            setTimeout(() => {
              setIsProcessing(false);
              payInvoice(invoice.id);
              Alert.alert(t('success', language), t('paymentSuccess', language));
            }, 1000);
          },
        },
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

  const statusColor = getStatusColor(invoice.status);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('invoiceDetail', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Invoice Header */}
        <Card style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={[styles.title, { color: colors.text }]}>
              {formatRoomTitle(invoice.roomName, language)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {isPaid ? t('paid', language) : t('unpaid', language)}
              </Text>
            </View>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('billingPeriod', language)}: {formatMonthPeriod(invoice.month, language)}
          </Text>
          {invoice.paidAt && (
            <Text style={[styles.paidAtText, { color: colors.success }]}>
              {language === 'en' ? 'Paid on' : 'Thanh toán ngày'}: {invoice.paidAt}
            </Text>
          )}
        </Card>

        {/* Detailed Items breakdown */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('invoiceSummary', language)}</Text>
        <Card style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>{t('rentFee', language)}</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {invoice.rentFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>{t('electricityFee', language)}</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {invoice.electricityFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>{t('waterFee', language)}</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {invoice.waterFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={[styles.itemLabel, { color: colors.text }]}>{t('serviceFee', language)}</Text>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {invoice.serviceFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={[styles.lineDivider, { backgroundColor: colors.border }]} />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>{t('totalFee', language)}</Text>
            <Text style={[styles.totalValue, { color: isPaid ? colors.success : colors.primary }]}>
              {invoice.totalFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </Card>

        {/* QR Code payment or Paid stamp */}
        {!isPaid ? (
          <View style={styles.paymentSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {language === 'en' ? 'Scan QR Code for Instant Bank Transfer' : 'Quét mã QR để chuyển khoản nhanh'}
            </Text>
            <Card style={styles.qrCard}>
              {invoice.paymentQrCodeUrl ? (
                <>
                  <Image
                    source={{ uri: invoice.paymentQrCodeUrl }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                  <Text style={[styles.qrHelperText, { color: colors.textSecondary }]}>
                    {language === 'en'
                      ? 'Open your Banking App or E-Wallet to scan this QR code'
                      : 'Mở ứng dụng Ngân hàng hoặc Ví điện tử quét mã QR này'}
                  </Text>
                </>
              ) : (
                <View style={{ padding: SPACING.md, alignItems: 'center' }}>
                  <Icon name="info" size={32} color={colors.textSecondary} style={{ marginBottom: SPACING.xs }} />
                  <Text style={[styles.qrHelperText, { color: colors.textSecondary }]}>
                    {language === 'en'
                      ? 'No QR code payment available for this invoice.'
                      : 'Chưa có thông tin mã QR thanh toán cho hóa đơn này.'}
                  </Text>
                </View>
              )}
            </Card>

            <Button
              title={language === 'en' ? 'I have completed transfer (Confirm)' : 'Tôi đã chuyển khoản (Xác nhận)'}
              onPress={handlePayment}
              loading={isProcessing}
              variant="primary"
              style={{ marginTop: SPACING.md, width: '100%' }}
            />
          </View>
        ) : (
          <Card style={[styles.successStampCard, { borderColor: colors.success, backgroundColor: `${colors.success}10` }]}>
            <Icon name="check" size={36} color={colors.success} style={{ marginBottom: SPACING.xs }} />
            <Text style={[styles.stampTitle, { color: colors.success }]}>
              {language === 'en' ? 'PAYMENT COMPLETED' : 'ĐÃ THANH TOÁN THÀNH CÔNG'}
            </Text>
            <Text style={[styles.stampDesc, { color: colors.text }]}>
              {language === 'en'
                ? 'Thank you! This invoice has been marked as fully paid in the dormitory system.'
                : 'Cảm ơn bạn! Hóa đơn này đã được ghi nhận thanh toán đầy đủ trên hệ thống quản lý phòng kí túc xá.'}
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
    paddingBottom: 80,
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
    padding: SPACING.md,
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
    fontWeight: '600',
    marginTop: 6,
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
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  breakdownCard: {
    padding: SPACING.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemLabel: {
    fontSize: SIZES.fontSm,
  },
  itemValue: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
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
    fontSize: SIZES.fontXl,
    fontWeight: '800',
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
