import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { BadgeIcon } from '../../components/BadgeIcon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const WelcomeScreen = () => {
  const { theme, navigate } = useApp();
  const colors = COLORS[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* App Title */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.primary }]}>DormiManager</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Hệ thống Quản lý Kí túc xá Hiện đại & Toàn diện
          </Text>
        </View>

        {/* Feature Box */}
        <View style={[styles.illustrationContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <BadgeIcon name="room" color={colors.primary} size={64} style={{ marginBottom: SPACING.md }} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>
            Tất cả dịch vụ trong một ứng dụng
          </Text>
          <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
            Theo dõi phòng ở, thanh toán hóa đơn điện nước nhanh chóng, gửi yêu cầu sửa chữa cơ sở vật chất tức thì.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Đăng Nhập Ngay"
            onPress={() => navigate('Login')}
            variant="primary"
          />
          <Button
            title="Đăng Ký Tài Khoản Mới"
            onPress={() => navigate('Register')}
            variant="outline"
            style={{ marginTop: SPACING.xs }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  appName: {
    fontSize: SIZES.fontTitle,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    marginVertical: SPACING.md,
  },
  featureTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: SIZES.fontXs,
    marginHorizontal: SPACING.sm,
  },
  quickAccessRow: {
    flexDirection: 'row',
    width: '100%',
  },
  quickBtn: {
    flex: 1,
  },
});
