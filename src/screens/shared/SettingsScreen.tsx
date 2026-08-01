import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const SettingsScreen = () => {
  const { theme, toggleTheme, language, setLanguage } = useApp();
  const colors = COLORS[theme];

  const [notifAnnounce, setNotifAnnounce] = useState(true);
  const [notifInvoice, setNotifInvoice] = useState(true);
  const [notifService, setNotifService] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Thiết Lập" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Appearance Configuration */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Giao diện & Ngôn ngữ</Text>
        <Card style={styles.card}>
          {/* Dark Mode Row */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Chế độ tối (Dark Mode)</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Chuyển đổi giao diện sang màu tối giúp bảo vệ mắt
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={theme === 'dark' ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Language Selection Row */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Ngôn ngữ ứng dụng</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Chọn ngôn ngữ hiển thị giao diện
              </Text>
            </View>
            <View style={[styles.langToggleContainer, { borderColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.langOption,
                  language === 'vi' && { backgroundColor: colors.primary }
                ]}
                onPress={() => setLanguage('vi')}
              >
                <Text style={[styles.langText, language === 'vi' ? { color: '#FFF' } : { color: colors.text }]}>VI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langOption,
                  language === 'en' && { backgroundColor: colors.primary }
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.langText, language === 'en' ? { color: '#FFF' } : { color: colors.text }]}>EN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Notifications Configuration */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông báo hệ thống</Text>
        <Card style={styles.card}>
          {/* Announcements */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Thông báo từ nhà trường</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Nhận tin tức khẩn cấp từ Ban Quản Lý KTX
              </Text>
            </View>
            <Switch
              value={notifAnnounce}
              onValueChange={setNotifAnnounce}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Invoices */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Nhắc nhở hóa đơn</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Thông báo khi phát hành hóa đơn phòng mới
              </Text>
            </View>
            <Switch
              value={notifInvoice}
              onValueChange={setNotifInvoice}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Service Requests */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Cập nhật sửa chữa sự cố</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Nhận thông báo khi kĩ thuật viên xử lý báo hỏng
              </Text>
            </View>
            <Switch
              value={notifService}
              onValueChange={setNotifService}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
        </Card>

        {/* Account security */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bảo mật tài khoản</Text>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Đổi mật khẩu', 'Tính năng thay đổi mật khẩu tài khoản trực tuyến.')}
          >
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Đổi mật khẩu</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Cập nhật mật khẩu bảo mật mới cho tài khoản
              </Text>
            </View>
            <Icon name="back" color={colors.textSecondary} size={16} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
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
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  card: {
    paddingVertical: SPACING.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.sm,
  },
  settingLeft: {
    flex: 1.5,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
  },
  langToggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    overflow: 'hidden',
  },
  langOption: {
    width: 32,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
