import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle } from '../../i18n/translations';

export const AdminStudentDetailScreen = () => {
  const { theme, language, screenParams, students, rooms, assignRoom, toggleUser } = useApp();
  const colors = COLORS[theme];

  const { studentId } = screenParams;
  const student = students.find(s => s.id === studentId);

  const [isAssigning, setIsAssigning] = useState(false);

  const handleToggleStatus = () => {
    const isPending = student?.status === 'Chờ duyệt';
    const actionText = isPending 
      ? (language === 'en' ? 'approve' : 'kích hoạt') 
      : (language === 'en' ? 'deactivate' : 'tạm khóa');
      
    Alert.alert(
      language === 'en' ? 'Confirm Status Change' : 'Xác nhận thay đổi',
      language === 'en'
        ? `Are you sure you want to ${actionText} account for ${student?.name}?`
        : `Bạn có chắc chắn muốn ${actionText} tài khoản của sinh viên ${student?.name}?`,
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: t('confirm', language),
          onPress: async () => {
            if (!student) return;
            setIsAssigning(true);
            try {
              await toggleUser(student.id);
              Alert.alert(t('success', language), language === 'en' ? 'Account status changed successfully!' : 'Đã thay đổi trạng thái tài khoản thành công!');
            } catch (e) {
              Alert.alert(t('error', language), language === 'en' ? 'Failed to update status.' : 'Không thể thay đổi trạng thái tài khoản.');
            } finally {
              setIsAssigning(false);
            }
          }
        }
      ]
    );
  };

  if (!student) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={t('studentProfile', language)} showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{language === 'en' ? 'Student not found.' : 'Không tìm thấy thông tin sinh viên.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get available rooms for assignment
  const availableRooms = rooms.filter(r => r.status === 'Còn chỗ' && r.id !== student.roomId);

  const handleAssignRoom = (roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    Alert.alert(
      t('assignRoom', language),
      language === 'en'
        ? `Assign ${student.name} to ${formatRoomTitle(targetRoom.name, language)} (${targetRoom.block})?`
        : `Xếp sinh viên ${student.name} vào phòng ${targetRoom.name} (${targetRoom.block})?`,
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: t('confirm', language),
          onPress: () => {
            setIsAssigning(true);
            setTimeout(() => {
              setIsAssigning(false);
              assignRoom(student.id, roomId);
              Alert.alert(t('success', language), language === 'en' ? `Assigned to ${formatRoomTitle(targetRoom.name, language)}!` : `Đã xếp phòng ${targetRoom.name} cho sinh viên ${student.name}!`);
            }, 600);
          }
        }
      ]
    );
  };

  const handleRemoveRoom = () => {
    Alert.alert(
      t('removeRoom', language),
      language === 'en'
        ? `Are you sure you want to remove ${student.name} from ${formatRoomTitle(student.roomName, language)}?`
        : `Bạn có chắc chắn muốn rút sinh viên ${student.name} ra khỏi phòng ${student.roomName}?`,
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: language === 'en' ? 'Remove' : 'Rút phòng',
          onPress: () => {
            setIsAssigning(true);
            setTimeout(() => {
              setIsAssigning(false);
              assignRoom(student.id, '');
              Alert.alert(t('success', language), language === 'en' ? 'Room assignment removed!' : `Đã rút phòng của sinh viên ${student.name}!`);
            }, 600);
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang ở': return colors.success;
      case 'Chờ duyệt': return colors.warning;
      case 'Đã chuyển đi': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('studentProfile', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Student Avatar Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <BadgeIcon name="profile" color={colors.primary} size={54} />
            <View style={styles.profileMainInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{student.name}</Text>
              <Text style={[styles.profileSub, { color: colors.textSecondary }]}>
                {t('studentId', language)}: {student.studentId} | {t('class', language)}: {student.class}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(student.status)}15`, alignSelf: 'flex-start' }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor(student.status) }]}>{student.status}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Contact details */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('email', language)}:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{student.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('phoneNumber', language)}:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{student.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('gender', language)}:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{student.gender}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Button
            title={student.status === 'Chờ duyệt' ? t('approveStudent', language) : t('deactivateStudent', language)}
            onPress={handleToggleStatus}
            loading={isAssigning}
            variant={student.status === 'Chờ duyệt' ? "primary" : "danger"}
            style={{ marginTop: SPACING.xs }}
          />
        </Card>

        {/* Room Assignment Management */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('roomStatus', language)}</Text>
        <Card style={styles.roomMgmtCard}>
          {student.roomId ? (
            <View>
              <View style={styles.roomAssignedRow}>
                <View>
                  <Text style={[styles.roomLabelText, { color: colors.textSecondary }]}>
                    {language === 'en' ? 'Currently residing in' : 'Đang lưu trú tại'}
                  </Text>
                  <Text style={[styles.roomValueText, { color: colors.primary }]}>
                    {formatRoomTitle(student.roomName, language)} ({student.block})
                  </Text>
                  <Text style={[styles.contractText, { color: colors.textSecondary }]}>
                    {t('contractPeriod', language)}: {student.contractStart} - {student.contractEnd}
                  </Text>
                </View>
                <BadgeIcon name="room" color={colors.primary} size={40} />
              </View>
              <Button
                title={t('removeRoom', language)}
                onPress={handleRemoveRoom}
                loading={isAssigning}
                variant="danger"
                style={{ marginTop: SPACING.md }}
              />
            </View>
          ) : (
            <View>
              <Text style={[styles.noRoomText, { color: colors.textSecondary }]}>
                {t('notAssignedStudent', language)}
              </Text>
              
              <Text style={[styles.selectLabel, { color: colors.text }]}>{t('selectRoomToAssign', language)}</Text>
              {availableRooms.length === 0 ? (
                <Text style={[styles.errorSelectText, { color: colors.danger }]}>
                  {t('noAvailableRooms', language)}
                </Text>
              ) : (
                <View style={styles.roomsAssignGrid}>
                  {availableRooms.map(room => (
                    <TouchableOpacity
                      key={room.id}
                      style={[styles.roomOptionBtn, { borderColor: colors.border, backgroundColor: theme === 'light' ? '#F1F5F9' : '#1E293B' }]}
                      onPress={() => handleAssignRoom(room.id)}
                    >
                      <Text style={[styles.roomOptionText, { color: colors.text }]}>
                        {formatRoomTitle(room.name, language)} ({room.block})
                      </Text>
                      <Text style={[styles.roomOptionBedCount, { color: colors.primary }]}>
                        {language === 'en' ? `${room.capacity - room.occupied} beds left` : `Còn ${room.capacity - room.occupied} chỗ`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </Card>

        {/* Violations Log */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('violationsLog', language)} ({student.violations.length})</Text>
        <Card style={styles.violationsCard}>
          {student.violations.length === 0 ? (
            <Text style={[styles.noViolationText, { color: colors.success }]}>
              {t('noViolations', language)}
            </Text>
          ) : (
            student.violations.map((violation, index) => (
              <View key={index} style={styles.violationItem}>
                <Icon name="alert" size={16} color={colors.danger} style={{ marginRight: SPACING.sm, marginTop: 2 }} />
                <Text style={[styles.violationText, { color: colors.text }]}>{violation}</Text>
              </View>
            ))
          )}
        </Card>
        
        {/* Extra spacing */}
        <View style={{ height: SPACING.xl }} />

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
  profileCard: {
    padding: SPACING.md,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileMainInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: SIZES.fontXl,
    fontWeight: 'bold',
  },
  profileSub: {
    fontSize: SIZES.fontXs,
    marginVertical: 4,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: SIZES.fontSm,
  },
  infoVal: {
    fontSize: SIZES.fontSm,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  roomMgmtCard: {
    padding: SPACING.md,
  },
  roomAssignedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomLabelText: {
    fontSize: SIZES.fontXs,
  },
  roomValueText: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  contractText: {
    fontSize: SIZES.fontXs,
  },
  noRoomText: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  selectLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  errorSelectText: {
    fontSize: SIZES.fontXs,
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  roomsAssignGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomOptionBtn: {
    width: '48%',
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  roomOptionText: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  roomOptionBedCount: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  violationsCard: {
    padding: SPACING.md,
  },
  noViolationText: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
  },
  violationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  violationText: {
    flex: 1,
    fontSize: SIZES.fontSm,
    lineHeight: 18,
  },
});
