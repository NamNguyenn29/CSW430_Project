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
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const AboutScreen = () => {
  const { theme } = useApp();
  const colors = COLORS[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Thông Tin Ứng Dụng" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Project Card */}
        <Card style={styles.card}>
          <Text style={[styles.title, { color: colors.primary }]}>DormiManager v1.0.0</Text>
          <Text style={[styles.desc, { color: colors.text }]}>
            Dự án ứng dụng di động quản lí kí túc xá tích hợp cho sinh viên và nhà trường. Hỗ trợ tra cứu phòng ở, đóng tiền điện nước, tạo yêu cầu sửa chữa và quản lý sinh viên.
          </Text>
        </Card>

        {/* Requirements Card */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Thành viên Nhóm phát triển</Text>
        <Card style={styles.card}>
          <View style={styles.memberItem}>
            <Text style={[styles.memberName, { color: colors.text }]}>1. Nguyễn Văn A (Nhóm Trưởng)</Text>
            <Text style={[styles.memberRole, { color: colors.textSecondary }]}>
              Mobile Frontend Developer - Thiết kế UI/UX & Routing
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.memberItem}>
            <Text style={[styles.memberName, { color: colors.text }]}>2. Trần Thị B</Text>
            <Text style={[styles.memberRole, { color: colors.textSecondary }]}>
              Backend Developer - Thiết kế Database & Xây dựng REST API
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.memberItem}>
            <Text style={[styles.memberName, { color: colors.text }]}>3. Lê Văn C</Text>
            <Text style={[styles.memberRole, { color: colors.textSecondary }]}>
              QA/Tester & Biên soạn tài liệu báo cáo dự án
            </Text>
          </View>
        </Card>

        {/* Tech Stack Card */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Công nghệ sử dụng</Text>
        <Card style={styles.card}>
          <View style={styles.techRow}>
            <Icon name="room" color={colors.primary} size={20} style={{ marginRight: SPACING.md }} />
            <Text style={[styles.techName, { color: colors.text }]}>React Native CLI (Bare Native)</Text>
          </View>
          <View style={styles.techRow}>
            <Icon name="info" color={colors.primary} size={20} style={{ marginRight: SPACING.md }} />
            <Text style={[styles.techName, { color: colors.text }]}>React Context State Store</Text>
          </View>
          <View style={styles.techRow}>
            <Icon name="settings" color={colors.primary} size={20} style={{ marginRight: SPACING.md }} />
            <Text style={[styles.techName, { color: colors.text }]}>React Native Paper (Material Design 3)</Text>
          </View>
          <View style={styles.techRow}>
            <Icon name="globe" color={colors.primary} size={20} style={{ marginRight: SPACING.md }} />
            <Text style={[styles.techName, { color: colors.text }]}>Lucide Vector Icons (Pure SVG)</Text>
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
  },
  card: {
    padding: SPACING.md,
  },
  title: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  desc: {
    fontSize: SIZES.fontSm,
    lineHeight: 20,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  memberItem: {
    paddingVertical: SPACING.sm,
  },
  memberName: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
  memberRole: {
    fontSize: SIZES.fontXs,
    marginTop: 4,
  },
  divider: {
    height: 1,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  techName: {
    fontSize: SIZES.fontSm,
    fontWeight: '500',
  },
});
