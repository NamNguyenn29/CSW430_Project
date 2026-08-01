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

export const StudentRoomScreen = () => {
  const { theme, currentUser, students, rooms, navigate } = useApp();
  const colors = COLORS[theme];

  const myRoom = rooms.find(r => r.id === currentUser.roomId);
  const roommates = students.filter(
    s => s.roomId === currentUser.roomId && s.id !== currentUser.id
  );

  const handleContact = (phone: string, name: string) => {
    Alert.alert(
      `Liên hệ ${name}`,
      `Chọn phương thức kết nối với ${name}`,
      [
        { text: 'Gọi điện', onPress: () => Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('Lỗi', 'Không thể gọi số này')) },
        { text: 'Gửi tin nhắn SMS', onPress: () => Linking.openURL(`sms:${phone}`).catch(() => Alert.alert('Lỗi', 'Không thể gửi SMS')) },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Phòng Ở Của Tôi" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {myRoom ? (
          <>
            {/* Room Basic Info */}
            <Card style={styles.roomHeaderCard}>
              <View style={styles.roomHeaderRow}>
                <View>
                  <Text style={styles.blockLabel}>{myRoom.block}</Text>
                  <Text style={[styles.roomTitle, { color: colors.text }]}>{myRoom.name}</Text>
                  <Text style={[styles.roomType, { color: colors.textSecondary }]}>
                    Loại phòng: {myRoom.type}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
                  <Text style={[styles.statusText, { color: colors.success }]}>{myRoom.status}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.roomMetaRow}>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Giá phòng</Text>
                  <Text style={[styles.metaValue, { color: colors.primary }]}>
                    {myRoom.price.toLocaleString('vi-VN')} đ/tháng
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Thành viên</Text>
                  <Text style={[styles.metaValue, { color: colors.text }]}>
                    {myRoom.occupied} / {myRoom.capacity}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Utility Indexes */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Số chỉ điện nước hiện tại</Text>
            <View style={styles.meterContainer}>
              <Card style={styles.meterBox}>
                <View style={{ alignItems: 'center' }}>
                  <BadgeIcon name="zap" color="#D97706" size={36} />
                  <Text style={[styles.meterTitle, { color: colors.textSecondary }]}>Số điện (kWh)</Text>
                  <Text style={[styles.meterValueText, { color: colors.text }]}>
                    {myRoom.electricityIndex}
                  </Text>
                </View>
              </Card>

              <Card style={styles.meterBox}>
                <View style={{ alignItems: 'center' }}>
                  <BadgeIcon name="droplet" color="#2563EB" size={36} />
                  <Text style={[styles.meterTitle, { color: colors.textSecondary }]}>Số nước (m³)</Text>
                  <Text style={[styles.meterValueText, { color: colors.text }]}>
                    {myRoom.waterIndex}
                  </Text>
                </View>
              </Card>
            </View>

            {/* Roommates List */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Bạn cùng phòng ({roommates.length})</Text>
            {roommates.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Chưa có thành viên khác trong phòng này.
              </Text>
            ) : (
              roommates.map(mate => (
                <Card key={mate.id} style={styles.mateCard}>
                  <View style={styles.mateRow}>
                    <BadgeIcon name="profile" color={colors.primary} size={32} />
                    <View style={styles.mateInfo}>
                      <Text style={[styles.mateName, { color: colors.text }]}>{mate.name}</Text>
                      <Text style={[styles.mateClass, { color: colors.textSecondary }]}>
                        MSSV: {mate.studentId} | Lớp: {mate.class}
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
              <Text style={[styles.noRoomTitle, { color: colors.text }]}>Chưa có thông tin phòng ở</Text>
              <Text style={[styles.noRoomDesc, { color: colors.textSecondary }]}>
                Bạn hiện chưa được phân phòng hoặc đang đợi ban quản lý kí túc xá xét duyệt đơn lưu trú.
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
