import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle } from '../../i18n/translations';

export const AdminRoomDetailScreen = () => {
  const { theme, language, screenParams, rooms, students, updateRoomMeter, deleteNode, goBack, navigate } = useApp();
  const colors = COLORS[theme];

  const { roomId } = screenParams;
  const room = rooms.find(r => r.id === roomId);

  const [waterIdx, setWaterIdx] = useState(room ? String(room.waterIndex) : '');
  const [elecIdx, setElecIdx] = useState(room ? String(room.electricityIndex) : '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!room) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={t('roomDetail', language)} showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{language === 'en' ? 'Room not found.' : 'Không tìm thấy phòng này.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get student objects of this room
  const occupantsList = students.filter(s => s.roomId === room.id);

  const handleUpdateMeters = () => {
    const wNum = parseInt(waterIdx, 10);
    const eNum = parseInt(elecIdx, 10);

    if (isNaN(wNum) || isNaN(eNum)) {
      Alert.alert(t('error', language), language === 'en' ? 'Please enter valid integer utility meter values.' : 'Vui lòng nhập chỉ số điện nước hợp lệ (dạng số nguyên).');
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      updateRoomMeter(room.id, wNum, eNum);
      Alert.alert(t('success', language), language === 'en' ? `Utility meters updated for ${formatRoomTitle(room.name, language)}!` : `Đã cập nhật chỉ số điện nước mới cho phòng ${room.name}!`);
    }, 600);
  };

  const handleDeleteRoom = () => {
    Alert.alert(
      t('deleteRoom', language),
      language === 'en'
        ? `Are you sure you want to delete ${formatRoomTitle(room.name, language)}?`
        : `Bạn có chắc chắn muốn xóa phòng ${room.name} không? Tất cả dữ liệu xếp phòng hiện tại sẽ bị xóa vĩnh viễn.`,
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: language === 'en' ? 'Delete' : 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteNode(room.id);
              Alert.alert(t('success', language), language === 'en' ? 'Room deleted successfully.' : 'Đã xóa phòng thành công.');
              goBack();
            } catch (e: any) {
              Alert.alert(t('error', language), e.message || 'Không thể xóa phòng này.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn chỗ': return colors.success;
      case 'Đầy': return colors.primary;
      case 'Đang sửa chữa': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={formatRoomTitle(room.name, language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Room Header Info */}
        <Card style={styles.headerCard}>
          <View style={styles.row}>
            <View>
              <Text style={styles.blockText}>{room.block}</Text>
              <Text style={[styles.title, { color: colors.text }]}>{formatRoomTitle(room.name, language)}</Text>
              <Text style={[styles.roomType, { color: colors.textSecondary }]}>{t('roomType', language)}: {room.type}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(room.status)}15` }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(room.status) }]}>{room.status}</Text>
            </View>
          </View>
        </Card>

        {/* Room Occupants */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('occupants', language)} ({occupantsList.length})</Text>
        {occupantsList.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('emptyRoom', language)}</Text>
          </Card>
        ) : (
          occupantsList.map(student => (
            <Card
              key={student.id}
              style={styles.studentCard}
              onPress={() => navigate('AdminStudentDetail', { studentId: student.id })}
            >
              <View style={styles.studentRow}>
                <BadgeIcon name="profile" color={colors.primary} size={32} />
                <View style={styles.studentInfo}>
                  <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                  <Text style={[styles.studentSub, { color: colors.textSecondary }]}>
                    {t('studentId', language)}: {student.studentId} | {t('class', language)}: {student.class}
                  </Text>
                </View>
                <View style={styles.detailsLinkWrapper}>
                  <Text style={[styles.detailsLink, { color: colors.primary }]}>{t('studentProfile', language)}</Text>
                  <Icon name="chevron-right" color={colors.primary} size={14} style={{ marginLeft: 2 }} />
                </View>
              </View>
            </Card>
          ))
        )}

        {/* Update Meter Indices */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('updateMeter', language)}</Text>
        <Card style={styles.meterCard}>
          <View style={styles.meterInputsRow}>
            <View style={styles.inputWrapper}>
              <Input
                label={t('electricityIndex', language)}
                placeholder={language === 'en' ? 'New electricity index' : 'Số điện mới'}
                keyboardType="numeric"
                value={elecIdx}
                onChangeText={setElecIdx}
                icon="zap"
              />
            </View>
            <View style={[styles.inputWrapper, { marginLeft: SPACING.md }]}>
              <Input
                label={t('waterIndex', language)}
                placeholder={language === 'en' ? 'New water index' : 'Số nước mới'}
                keyboardType="numeric"
                value={waterIdx}
                onChangeText={setWaterIdx}
                icon="droplet"
              />
            </View>
          </View>
          <Button
            title={t('updateMetersBtn', language)}
            onPress={handleUpdateMeters}
            loading={isUpdating}
            variant="secondary"
            style={{ marginTop: SPACING.sm }}
          />
        </Card>

        {/* Create Invoice Action */}
        <Button
          title={t('createInvoice', language)}
          onPress={() => navigate('AdminAddInvoice', { preselectedRoomId: room.id })}
          variant="primary"
          icon="plus"
          style={{ marginTop: SPACING.md }}
        />

        {/* Delete Room Action */}
        <Button
          title={t('deleteRoom', language)}
          onPress={handleDeleteRoom}
          loading={isDeleting}
          variant="danger"
          icon="trash"
          style={{ marginTop: SPACING.xs, marginBottom: SPACING.xl }}
        />

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
  headerCard: {
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockText: {
    color: '#6366F1',
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.fontXxl,
    fontWeight: 'bold',
    marginTop: 2,
  },
  roomType: {
    fontSize: SIZES.fontXs,
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyCard: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.fontXs,
  },
  studentCard: {
    marginVertical: 4,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  studentName: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
  },
  studentSub: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  detailsLinkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsLink: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  meterCard: {
    padding: SPACING.md,
  },
  meterInputsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flex: 1,
  },
});
