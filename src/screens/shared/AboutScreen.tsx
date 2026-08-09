import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t } from '../../i18n/translations';

export const AboutScreen = () => {
  const { theme, language } = useApp();
  const colors = COLORS[theme];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title={t('aboutApp', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Project Card */}
        <Card style={styles.card}>
          <Text style={[styles.title, { color: colors.primary }]}>
            DormlyManager v1.0.0
          </Text>
          <Text style={[styles.desc, { color: colors.text }]}>
            {language === 'en'
              ? 'An integrated mobile management application for students and dormitory administration. Supports room lookup, invoice payments, incident reporting, and resident management.'
              : 'Dự án ứng dụng di động quản lý kí túc xá tích hợp cho sinh viên và nhà trường. Hỗ trợ tra cứu phòng ở, đóng tiền điện nước, tạo yêu cầu sửa chữa và quản lý sinh viên.'}
          </Text>
        </Card>

        {/* Tech Stack Card */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {language === 'en' ? 'Technology Stack' : 'Công nghệ sử dụng'}
        </Text>
        <Card style={styles.card}>
          <View style={styles.techRow}>
            <Icon
              name="room"
              color={colors.primary}
              size={20}
              style={{ marginRight: SPACING.md }}
            />
            <Text style={[styles.techName, { color: colors.text }]}>
              React Native & TypeScript
            </Text>
          </View>
          <View style={styles.techRow}>
            <Icon
              name="info"
              color={colors.primary}
              size={20}
              style={{ marginRight: SPACING.md }}
            />
            <Text style={[styles.techName, { color: colors.text }]}>
              Redux Toolkit + Redux Thunk
            </Text>
          </View>
          <View style={styles.techRow}>
            <Icon
              name="settings"
              color={colors.primary}
              size={20}
              style={{ marginRight: SPACING.md }}
            />
            <Text style={[styles.techName, { color: colors.text }]}>
              Firebase Auth & Google Sign-In
            </Text>
          </View>
          <View style={styles.techRow}>
            <Icon
              name="globe"
              color={colors.primary}
              size={20}
              style={{ marginRight: SPACING.md }}
            />
            <Text style={[styles.techName, { color: colors.text }]}>
              Lucide React Native Icons (SVG)
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
