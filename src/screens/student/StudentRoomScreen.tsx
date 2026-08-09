import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle } from '../../i18n/translations';

export const StudentRoomScreen = () => {
  const { theme, language, currentUser, students, rooms } = useApp();
  const colors = COLORS[theme];

  const myRoom = rooms.find(r => r.id === currentUser?.roomId);
  const roommates = students.filter(
    s => s.roomId === currentUser?.roomId && s.id !== currentUser?.id
  );

  const handleContact = (phone: string, name: string) => {
    Alert.alert(
      language === 'en' ? `Contact ${name}` : `Liên hệ ${name}`,
      language === 'en' ? `Choose communication method with ${name}` : `Chọn phương thức kết nối với ${name}`,
      [
        { text: t('call', language), onPress: () => Linking.openURL(`tel:${phone}`).catch(() => Alert.alert(t('error', language), 'Cannot make phone call')) },
        { text: t('sms', language), onPress: () => Linking.openURL(`sms:${phone}`).catch(() => Alert.alert(t('error', language), 'Cannot send SMS')) },
        { text: t('cancel', language), style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('myRoom', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {myRoom ? (
          <>
            {/* Room Basic Info */}
            <Card style={styles.roomHeaderCard}>
              <View style={styles.roomHeaderRow}>
                <View>
                  <Text style={styles.blockLabel}>{myRoom.block}</Text>
                  <Text style={[styles.roomTitle, { color: colors.text }]}>{formatRoomTitle(myRoom.name, language)}</Text>
                  <Text style={[styles.roomType, { color: colors.textSecondary }]}>
                    {t('roomType', language)}: {myRoom.type}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
                  <Text style={[styles.statusText, { color: colors.success }]}>{myRoom.status}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.roomMetaRow}>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{t('roomPrice', language)}</Text>
                  <Text style={[styles.metaValue, { color: colors.primary }]}>
                    {myRoom.price.toLocaleString('vi-VN')} {language === 'en' ? 'VND/month' : 'đ/tháng'}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{t('members', language)}</Text>
                  <Text style={[styles.metaValue, { color: colors.text }]}>
                    {myRoom.occupied} / {myRoom.capacity}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Utility Indexes */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('updateMeter', language)}</Text>
            <View style={styles.meterContainer}>
              <Card style={styles.meterBox}>
                <View style={{ alignItems: 'center' }}>
                  <BadgeIcon name="zap" color="#D97706" size={36} />
                  <Text style={[styles.meterTitle, { color: colors.textSecondary }]}>{t('electricityIndex', language)}</Text>
                  <Text style={[styles.meterValueText, { color: colors.text }]}>
                    {myRoom.electricityIndex}
                  </Text>
                </View>
              </Card>

              <Card style={styles.meterBox}>
                <View style={{ alignItems: 'center' }}>
                  <BadgeIcon name="droplet" color="#2563EB" size={36} />
                  <Text style={[styles.meterTitle, { color: colors.textSecondary }]}>{t('waterIndex', language)}</Text>
                  <Text style={[styles.meterValueText, { color: colors.text }]}>
                    {myRoom.waterIndex}
                  </Text>
                </View>
              </Card>
            </View>

            {/* Roommates List */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('roommates', language)} ({roommates.length})</Text>
            {roommates.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('noRoommates', language)}
              </Text>
            ) : (
              roommates.map(mate => (
                <Card key={mate.id} style={styles.mateCard}>
                  <View style={styles.mateRow}>
                    <BadgeIcon name="profile" color={colors.primary} size={32} />
                    <View style={styles.mateInfo}>
                      <Text style={[styles.mateName, { color: colors.text }]}>{mate.name}</Text>
                      <Text style={[styles.mateClass, { color: colors.textSecondary }]}>
                        {t('studentId', language)}: {mate.studentId} | {t('class', language)}: {mate.class}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleContact(mate.phone, mate.name)}
                      style={[styles.contactBtn, { backgroundColor: `${colors.primary}15` }]}
                    >
                      <Icon name="phone" color={colors.primary} size={18} />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))
            )}
          </>
        ) : (
          <Card style={styles.noRoomCard}>
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="room" color={colors.textSecondary} size={48} style={{ marginBottom: SPACING.md }} />
              <Text style={[styles.noRoomTitle, { color: colors.text }]}>{t('noRoomAssigned', language)}</Text>
              <Text style={[styles.noRoomDesc, { color: colors.textSecondary }]}>
                {t('noRoomAssignedDesc', language)}
              </Text>
            </View>
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
  roomHeaderCard: {
    padding: SPACING.md,
  },
  roomHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  blockLabel: {
    color: '#2563EB',
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  roomTitle: {
    fontSize: SIZES.fontXxl,
    fontWeight: '700',
    marginTop: 2,
  },
  roomType: {
    fontSize: SIZES.fontSm,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSm,
  },
  statusText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  roomMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SPACING.xs,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: SIZES.fontXs,
  },
  metaValue: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  meterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -SPACING.xs,
  },
  meterBox: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    paddingVertical: SPACING.md,
  },
  meterTitle: {
    fontSize: SIZES.fontXs,
    marginTop: SPACING.xs,
  },
  meterValueText: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    marginTop: 4,
  },
  emptyText: {
    fontSize: SIZES.fontSm,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  mateCard: {
    marginVertical: SPACING.xs,
  },
  mateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mateInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  mateName: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
  },
  mateClass: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRoomCard: {
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  noRoomTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  noRoomDesc: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
